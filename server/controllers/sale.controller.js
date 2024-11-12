const { Order, OrderItem } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

exports.getStatistics = async (req, res, next) => {
  const { range, date, week, month, year, paid } = req.query;

  let startDate, endDate;

  switch (range) {
    case "today":
      startDate = moment().startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
      break;
    case "yesterday":
      startDate = moment().subtract(1, "day").startOf("day").toDate();
      endDate = moment().subtract(1, "day").endOf("day").toDate();
      break;
    case "last7days":
      startDate = moment().subtract(7, "days").startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
      break;
    case "last30days":
      startDate = moment().subtract(30, "days").startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
      break;
    case "date":
      startDate = moment(date).startOf("day").toDate();
      endDate = moment(date).endOf("day").toDate();
      break;
    case "week":
      startDate = moment(week, "YYYY-WW").startOf("week").toDate();
      endDate = moment(week, "YYYY-WW").endOf("week").toDate();
      break;
    case "month":
      startDate = moment(`${year}-${month}-01`).startOf("month").toDate();
      endDate = moment(`${year}-${month}-01`).endOf("month").toDate();
      break;
    case "year":
      startDate = moment(`${year}-01-01`).startOf("year").toDate();
      endDate = moment(`${year}-12-31`).endOf("year").toDate();
      break;
    default:
      return res.status(400).json({ message: "Invalid range specified" });
  }

  try {
    const whereCondition = {
      status: "completed",
      createdAt: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    };

    const orders = await Order.findAll({
      where: whereCondition,
      include: [
        {
          model: OrderItem,
          as: "order_items",
          attributes: ["product_id", "quantity"],
        },
      ],
    });

    const totalSales = orders.reduce((acc, order) => acc + +order.total, 0);
    const totalOrders = orders.length;

    // const productRanking = orders.reduce((acc, order) => {
    //   order.order_items.forEach((item) => {
    //     if (acc[item.product_id]) {
    //       acc[item.product_id] += +item.quantity;
    //     } else {
    //       acc[item.product_id] = +item.quantity;
    //     }
    //   });
    //   return acc;
    // }, {});

    // const sortedProductRanking = Object.keys(productRanking).sort(
    //   (a, b) => productRanking[b] - productRanking[a]
    // );

    let chartData = [];
    if (range === "date" || range === "today" || range === "yesterday") {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const currentDateTime = moment(); // Get current date and time
      const selectedDate = moment(date).startOf("day"); // Start of the selected day

      chartData = hours.map((hour) => {
        const hourString = `${hour.toString().padStart(2, "0")}:00`;

        // Define the start and end of the hour interval
        const hourStart = selectedDate.clone().add(hour, "hours");
        const hourEnd = hourStart.clone().add(1, "hour");

        const sales = orders.reduce((acc, order) => {
          const orderDateTime = moment(order.createdAt);

          // Check if order was created within the hour interval
          return orderDateTime.isBetween(hourStart, hourEnd, null, "[)")
            ? acc + Number(order.total)
            : acc;
        }, 0);

        return {
          hourRange: hourString,
          sales: hourStart.isBefore(currentDateTime) ? sales : null, // Only show data up to the current time
          orders: orders.filter((order) =>
            moment(order.createdAt).isBetween(hourStart, hourEnd, null, "[)")
          ).length,
        };
      });
    } else {
      const dateRange = [];
      let currentDate = moment(startDate);
      while (currentDate.isSameOrBefore(endDate)) {
        dateRange.push(currentDate.format("YYYY-MM-DD"));
        currentDate = currentDate.add(1, "day");
      }

      chartData = dateRange.reduce((acc, date) => {
        const sales = orders.reduce((acc, order) => {
          const orderDate = moment(order.createdAt).format("YYYY-MM-DD");
          return orderDate === date ? acc + +order.total : acc;
        }, 0);

        // return in { x , y } format
        return {
          ...acc,
          date: date,
          sales: sales,
        };
      }, {});
    }

    return res.json({
      data: chartData,
      total_sales: totalSales,
      total_orders: totalOrders,
      // Average value of product(s) from your store sold in a single order, over the selected time period. Total sales divided by total number of orders
      sales_per_order: totalOrders > 0 ? totalSales / totalOrders : 0,
      total_customers: orders.reduce((acc, order) => {
        if ((order.user_id && !acc.includes(order.user_id)) || (order.guest_email && !acc.includes(order.guest_email))) {
          acc.push(order.user_id) || acc.push(order.guest_email);
        }
        return acc;
      }
      , []).length,
    });
  } catch (error) {
    next(error);
  }
};
