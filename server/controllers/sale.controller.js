const { Order, OrderItem, Product, Category } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const exceljs = require("exceljs");

const getStartEndDates = (range, date, week, month, year)  => {
  const today = moment().startOf("day");
  switch (range) {
    case "today":
      return {
        startDate: today.toDate(),
        endDate: today.endOf("day").toDate(),
      };
    case "yesterday":
      return {
        startDate: today.subtract(1, "day").startOf("day").toDate(),
        endDate: today.endOf("day").toDate(),
      };
    case "last7days":
      return {
        startDate: today.subtract(7, "days").toDate(),
        endDate: moment().toDate(),
      };
    case "last30days":
      return {
        startDate: today.subtract(30, "days").toDate(),
        endDate: moment().toDate(),
      };
    case "date":
      return {
        startDate: moment(date).startOf("day").toDate(),
        endDate: moment(date).endOf("day").toDate(),
      };
    case "week":
      return {
        startDate: moment(week, "YYYY-WW").startOf("week").toDate(),
        endDate: moment(week, "YYYY-WW").endOf("week").toDate(),
      };
    case "month":
      return {
        startDate: moment(`${year}-${month}-01`).startOf("month").toDate(),
        endDate: moment(`${year}-${month}-01`).endOf("month").toDate(),
      };
    case "year":
      return {
        startDate: moment(`${year}-01-01`).startOf("year").toDate(),
        endDate: moment(`${year}-12-31`).endOf("year").toDate(),
      };
    default:
      throw new Error("Invalid range specified");
  }
};

exports.getStatistics = async (req, res, next) => {
  const { range, date, week, month, year, paid } = req.query;
  try {
    const { startDate, endDate } = getStartEndDates(range, date, week, month, year);
    const previousStartDate = moment(startDate).subtract(endDate - startDate, "ms").toDate();
    const previousEndDate = startDate;

    const orders = await Order.findAll({
      where: {
        status: "completed",
        createdAt: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      include: [
        {
          model: OrderItem,
          as: "order_items",
          attributes: ["product_id", "quantity", "unit_price"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_name"],
              include: [
                {
                  model: Category,
                  as: "categories",
                  attributes: ["id","name"],
                },
              ]
            },
          ]
        },
      ],
    });

    const cancelledOrders = await Order.findAll({
      where: {
        status: "cancelled",
        createdAt: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      include: [
        {
          model: OrderItem,
          as: "order_items",
          attributes: ["product_id", "quantity", "unit_price"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_name"],
              include: [
                {
                  model: Category,
                  as: "categories",
                  attributes: ["id","name"],
                },
              ]
            },
          ]
        },
      ],
    })

    const totalSales = Number(orders.reduce((acc, order) => acc + +order.total, 0).toFixed(2));
    const totalOrders = orders.length;
    const totalCancelledOrders = cancelledOrders.length;
    const salesPerOrder = totalOrders > 0 ? Number((totalSales / totalOrders).toFixed(2)) : 0;

    const previousOrders = await Order.findAll({
      where: {
        status: "completed",
        createdAt: { [Op.gte]: previousStartDate, [Op.lt]: previousEndDate },
      },
    })

    const previousCancelledOrders = await Order.findAll({
      where: {
        status: "cancelled",
        createdAt: { [Op.gte]: previousStartDate, [Op.lt]: previousEndDate },
      },
    })

    const totalPreviousSales = Number(previousOrders.reduce((acc, order) => acc + +order.total, 0).toFixed(2));
    const totalPreviousOrders = previousOrders.length;
    const totalPreviousCancelledOrders = previousCancelledOrders.length;
    const salesPerOrderPrevious = totalPreviousOrders > 0 ? Number((totalPreviousSales / totalPreviousOrders).toFixed(2)) : 0;

    const salesPercentageDiff = totalPreviousSales > 0 ? Number((((totalSales - totalPreviousSales) / totalPreviousSales) * 100).toFixed(2)) : 0;
    const ordersPercentageDiff = totalPreviousOrders > 0 ? Number((((totalOrders - totalPreviousOrders) / totalPreviousOrders) * 100).toFixed(2)) : 0;
    const cancelledOrdersPercentageDiff = totalPreviousCancelledOrders > 0 ? Number((((totalCancelledOrders - totalPreviousCancelledOrders) / totalPreviousCancelledOrders) * 100).toFixed(2)) : 0;
    const salesPerOrderPercentageDiff = salesPerOrderPrevious > 0 ? Number((((salesPerOrder - salesPerOrderPrevious) / salesPerOrderPrevious) * 100).toFixed(2)) : 0;

    const generateChartData = () => {
      const currentDateTime = moment();
      const chartDataGenerators = {
        date: () => generateHourlyData(),
        today: () => generateHourlyData(),
        yesterday: () => generateHourlyData(),
        week: () => generateDailyData(7),
        month: () => generateDailyData(moment(startDate).daysInMonth()),
        year: () => generateMonthlyData(),
        last7days: () => generateDailyData(7),
        last30days: () => generateDailyData(30),
      };
      return chartDataGenerators[range]?.();

      function generateHourlyData() {
        return Array.from({ length: 24 }, (_, hour) => {
          const hourStart = moment(startDate).add(hour, "hours");
          const hourEnd = hourStart.clone().add(1, "hour");

          return buildChartDataEntry(
            hourStart,
            hourEnd,
            `${hour.toString().padStart(2, "0")}:00`
          );
        });
      }

      function generateDailyData(days) {
        return Array.from({ length: days }, (_, day) => {
          const dayStart = moment(startDate).add(day, "days");
          const dayEnd = dayStart.clone().add(1, "day");

          return buildChartDataEntry(dayStart, dayEnd, `${day + 1}`);
        });
      }

      function generateMonthlyData() {
        return Array.from({ length: 12 }, (_, month) => {
          const monthStart = moment(startDate)
            .add(month, "months")
            .startOf("month");
          const monthEnd = monthStart.clone().endOf("month");

          return buildChartDataEntry(
            monthStart,
            monthEnd,
            monthStart.format("MMM")
          );
        });
      }

      function buildChartDataEntry(start, end, label) {
        const sales = orders.reduce(
          (acc, order) =>
            moment(order.createdAt).isBetween(start, end, null, "[)")
              ? acc + Number(order.total)
              : acc,
          0
        );

        const orderCount = orders.filter((order) =>
          moment(order.createdAt).isBetween(start, end, null, "[)")
        ).length;

        const uniqueCustomers = new Set(
          orders
            .filter((order) =>
              moment(order.createdAt).isBetween(start, end, null, "[)")
            )
            .map((order) => order.user_id || order.guest_email)
        ).size;

        return {
          label,
          sales: start.isBefore(currentDateTime) ? Number(sales.toFixed(2)) : null,
          orders: start.isBefore(currentDateTime) ? orderCount : null,
          customers: start.isBefore(currentDateTime) ? uniqueCustomers : null,
        };
      }
    };

    const chartData = generateChartData();
    const twelveMonthsBeforeStart = moment(startDate)
      .subtract(12, "months")
      .toDate();
    const uniqueCustomers = [
      ...new Set(orders.map((order) => order.user_id || order.guest_email)),
    ];
    const previousUniqueCustomers = [
      ...new Set(previousOrders.map((order) => order.user_id || order.guest_email)),
    ];

    const totalCustomers = uniqueCustomers.length;
    const totalPreviousCustomers = previousUniqueCustomers.length;
    const totalCustomersPercentageDiff = totalPreviousCustomers > 0 ? Number((((totalCustomers - totalPreviousCustomers) / totalPreviousCustomers) * 100).toFixed(2)) : 0;

    const previousOrdersIn12 = await Order.findAll({
      where: {
        status: "completed",
        createdAt: { [Op.gte]: twelveMonthsBeforeStart, [Op.lt]: startDate },
      },
    });

    const previousCustomerSet = new Set(
      previousOrdersIn12.map((order) => order.user_id || order.guest_email)
    );
    const existingCustomers = uniqueCustomers.filter((customer) =>
      previousCustomerSet.has(customer)
    ).length;
    const newCustomers = uniqueCustomers.length - existingCustomers;

    const existingCustomersPercentage =
      (existingCustomers / uniqueCustomers.length) * 100 || 0;
    const newCustomersPercentage =
      (newCustomers / uniqueCustomers.length) * 100 || 0;
    const returningRate = Number(((existingCustomers / uniqueCustomers.length) * 100).toFixed(2)) || 0;

    const previousExistingCustomers = previousUniqueCustomers.filter((customer) =>
      previousCustomerSet.has(customer)
    ).length;
    const previousNewCustomers = previousUniqueCustomers.length - previousExistingCustomers;
    const previousReturningRate = Number(((previousExistingCustomers / previousUniqueCustomers.length) * 100).toFixed(2)) || 0;
    const previousExistingCustomersPercentage = (previousExistingCustomers / previousUniqueCustomers.length) * 100 || 0;
    const previousNewCustomersPercentage = (previousNewCustomers / previousUniqueCustomers.length) * 100 || 0; 
    const existingCustomersPercentageDiff = previousExistingCustomersPercentage > 0 ? Number((((existingCustomersPercentage - previousExistingCustomersPercentage) / previousExistingCustomersPercentage) * 100).toFixed(2)) : 0;
    const newCustomersPercentageDiff = previousNewCustomersPercentage > 0 ? Number((((newCustomersPercentage - previousNewCustomersPercentage) / previousNewCustomersPercentage) * 100).toFixed(2)) : 0;
    const returningRatePercentageDiff = previousReturningRate > 0 ? Number((((returningRate - previousReturningRate) / previousReturningRate) * 100).toFixed(2)) : 0;

    const productRankingData = {};
    orders.forEach((order) => {
      order?.order_items?.forEach((item) => {
        const { product_id, quantity, unit_price } = item;
        if (!productRankingData[product_id]) {
          productRankingData[product_id] = { quantity: 0, sales: 0, product_name: "" };
        }
        productRankingData[product_id].product_name = item.product.product_name;
        productRankingData[product_id].quantity += Number(quantity);
        productRankingData[product_id].sales += Number(quantity) * Number(unit_price);
      });
    });

    const categoryRankingData = {};
    orders.forEach((order) => {
      order?.order_items?.forEach((item) => {
        const { product } = item;
        const { categories } = product;
        categories.forEach((category) => {
          const { id, name } = category;
          if (!categoryRankingData[id]) {
            categoryRankingData[id] = { quantity: 0, sales: 0, category_name: "" };
          }
          categoryRankingData[id].category_name = name;
          categoryRankingData[id].quantity += Number(item.quantity);
          categoryRankingData[id].sales += Number(item.quantity) * Number(item.unit_price);
        });
      });
    })

    const productRanking = Object.entries(productRankingData)
      .map(([product_id, data]) => ({
        product_id: product_id,
        product_name: data.product_name,
        units_sold: data.quantity,
        total_sales: Number(data.sales.toFixed(2)),
      }))
      .sort((a, b) => b.units_sold - a.units_sold).slice(0, 5);

    const categoryRanking = Object.entries(categoryRankingData)
      .map(([category_id, data]) => ({
        category_id: category_id,
        category_name: data.category_name,
        units_sold: data.quantity,
        total_sales: Number(data.sales.toFixed(2)),
      }))
      .sort((a, b) => b.units_sold - a.units_sold).slice(0, 5);

    res.json({
      line_chart_data: chartData,
      pie_chart_data: [
        {
          type: "Existing Customer",
          percentage: existingCustomersPercentage.toFixed(2),
        },
        {
          type: "New Customer",
          percentage: newCustomersPercentage.toFixed(2),
        },
      ],
      product_ranking: productRanking,
      category_ranking: categoryRanking,
      total_sales: totalSales,
      total_orders: totalOrders,
      cancelled_orders: totalCancelledOrders,
      sales_per_order: salesPerOrder,
      total_customers: totalCustomers,
      existing_customers: existingCustomers,
      new_customers: newCustomers,
      returning_rate: returningRate,
      sales_percentage_diff: salesPercentageDiff,
      orders_percentage_diff: ordersPercentageDiff,
      cancelled_orders_percentage_diff: cancelledOrdersPercentageDiff,
      sales_per_order_percentage_diff: salesPerOrderPercentageDiff,
      customers_percentage_diff: totalCustomersPercentageDiff,
      existing_customers_percentage_diff: existingCustomersPercentageDiff,
      new_customers_percentage_diff: newCustomersPercentageDiff,
      returning_rate_percentage_diff: returningRatePercentageDiff,
    });
  } catch (error) {
    next(error);
  }
};

exports.exportReports = async (req, res, next) => {
  const { range, date, week, month, year } = req.query;

  try {
    const { startDate, endDate } = getStartEndDates(range, date, week, month, year);
    const previousStartDate = moment(startDate).subtract(endDate - startDate, "ms").toDate();
    const previousEndDate = startDate;

    const orders = await Order.findAll({
      where: {
        status: "completed",
        createdAt: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      include: [
        {
          model: OrderItem,
          as: "order_items",
          attributes: ["product_id", "quantity", "unit_price"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_name"],
              include: [
                {
                  model: Category,
                  as: "categories",
                  attributes: ["id","name"],
                },
              ]
            },
          ]
        },
      ],
    });

    const cancelledOrders = await Order.findAll({
      where: {
        status: "cancelled",
        createdAt: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      include: [
        {
          model: OrderItem,
          as: "order_items",
          attributes: ["product_id", "quantity", "unit_price"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_name"],
              include: [
                {
                  model: Category,
                  as: "categories",
                  attributes: ["id","name"],
                },
              ]
            },
          ]
        },
      ],
    })

    const totalSales = Number(orders.reduce((acc, order) => acc + +order.total, 0).toFixed(2));
    const totalOrders = orders.length;
    const totalCancelledOrders = cancelledOrders.length;
    const salesPerOrder = totalOrders > 0 ? Number((totalSales / totalOrders).toFixed(2)) : 0;

    const previousOrders = await Order.findAll({
      where: {
        status: "completed",
        createdAt: { [Op.gte]: previousStartDate, [Op.lt]: previousEndDate },
      },
    })

    const previousCancelledOrders = await Order.findAll({
      where: {
        status: "cancelled",
        createdAt: { [Op.gte]: previousStartDate, [Op.lt]: previousEndDate },
      },
    })

    const totalPreviousSales = Number(previousOrders.reduce((acc, order) => acc + +order.total, 0).toFixed(2));
    const totalPreviousOrders = previousOrders.length;
    const totalPreviousCancelledOrders = previousCancelledOrders.length;
    const salesPerOrderPrevious = totalPreviousOrders > 0 ? Number((totalPreviousSales / totalPreviousOrders).toFixed(2)) : 0;

    const salesPercentageDiff = totalPreviousSales > 0 ? Number((((totalSales - totalPreviousSales) / totalPreviousSales) * 100).toFixed(2)) : 0;
    const ordersPercentageDiff = totalPreviousOrders > 0 ? Number((((totalOrders - totalPreviousOrders) / totalPreviousOrders) * 100).toFixed(2)) : 0;
    const cancelledOrdersPercentageDiff = totalPreviousCancelledOrders > 0 ? Number((((totalCancelledOrders - totalPreviousCancelledOrders) / totalPreviousCancelledOrders) * 100).toFixed(2)) : 0;
    const salesPerOrderPercentageDiff = salesPerOrderPrevious > 0 ? Number((((salesPerOrder - salesPerOrderPrevious) / salesPerOrderPrevious) * 100).toFixed(2)) : 0;

    const twelveMonthsBeforeStart = moment(startDate)
      .subtract(12, "months")
      .toDate();
    const uniqueCustomers = [
      ...new Set(orders.map((order) => order.user_id || order.guest_email)),
    ];
    const previousUniqueCustomers = [
      ...new Set(previousOrders.map((order) => order.user_id || order.guest_email)),
    ];

    const totalCustomers = uniqueCustomers.length;
    const totalPreviousCustomers = previousUniqueCustomers.length;
    const totalCustomersPercentageDiff = totalPreviousCustomers > 0 ? Number((((totalCustomers - totalPreviousCustomers) / totalPreviousCustomers) * 100).toFixed(2)) : 0;

    const previousOrdersIn12 = await Order.findAll({
      where: {
        status: "completed",
        createdAt: { [Op.gte]: twelveMonthsBeforeStart, [Op.lt]: startDate },
      },
    });

    const previousCustomerSet = new Set(
      previousOrdersIn12.map((order) => order.user_id || order.guest_email)
    );
    const existingCustomers = uniqueCustomers.filter((customer) =>
      previousCustomerSet.has(customer)
    ).length;
    const newCustomers = uniqueCustomers.length - existingCustomers;

    const existingCustomersPercentage =
      (existingCustomers / uniqueCustomers.length) * 100 || 0;
    const newCustomersPercentage =
      (newCustomers / uniqueCustomers.length) * 100 || 0;
    const returningRate = Number(((existingCustomers / uniqueCustomers.length) * 100).toFixed(2)) || 0;

    const previousExistingCustomers = previousUniqueCustomers.filter((customer) =>
      previousCustomerSet.has(customer)
    ).length;
    const previousNewCustomers = previousUniqueCustomers.length - previousExistingCustomers;
    const previousReturningRate = Number(((previousExistingCustomers / previousUniqueCustomers.length) * 100).toFixed(2)) || 0;
    const previousExistingCustomersPercentage = (previousExistingCustomers / previousUniqueCustomers.length) * 100 || 0;
    const previousNewCustomersPercentage = (previousNewCustomers / previousUniqueCustomers.length) * 100 || 0; 
    const existingCustomersPercentageDiff = previousExistingCustomersPercentage > 0 ? Number((((existingCustomersPercentage - previousExistingCustomersPercentage) / previousExistingCustomersPercentage) * 100).toFixed(2)) : 0;
    const newCustomersPercentageDiff = previousNewCustomersPercentage > 0 ? Number((((newCustomersPercentage - previousNewCustomersPercentage) / previousNewCustomersPercentage) * 100).toFixed(2)) : 0;
    const returningRatePercentageDiff = previousReturningRate > 0 ? Number((((returningRate - previousReturningRate) / previousReturningRate) * 100).toFixed(2)) : 0;

    const productRankingData = {};
    orders.forEach((order) => {
      order?.order_items?.forEach((item) => {
        const { product_id, quantity, unit_price } = item;
        if (!productRankingData[product_id]) {
          productRankingData[product_id] = { quantity: 0, sales: 0, product_name: "" };
        }
        productRankingData[product_id].product_name = item.product.product_name;
        productRankingData[product_id].quantity += Number(quantity);
        productRankingData[product_id].sales += Number(quantity) * Number(unit_price);
      });
    });

    const categoryRankingData = {};
    orders.forEach((order) => {
      order?.order_items?.forEach((item) => {
        const { product } = item;
        const { categories } = product;
        categories.forEach((category) => {
          const { id, name } = category;
          if (!categoryRankingData[id]) {
            categoryRankingData[id] = { quantity: 0, sales: 0, category_name: "" };
          }
          categoryRankingData[id].category_name = name;
          categoryRankingData[id].quantity += Number(item.quantity);
          categoryRankingData[id].sales += Number(item.quantity) * Number(item.unit_price);
        });
      });
    })

    const productRanking = Object.entries(productRankingData)
      .map(([product_id, data]) => ({
        product_id: product_id,
        product_name: data.product_name,
        units_sold: data.quantity,
        total_sales: Number(data.sales.toFixed(2)),
      }))
      .sort((a, b) => b.units_sold - a.units_sold).slice(0, 5);

    const categoryRanking = Object.entries(categoryRankingData)
      .map(([category_id, data]) => ({
        category_id: category_id,
        category_name: data.category_name,
        units_sold: data.quantity,
        total_sales: Number(data.sales.toFixed(2)),
      }))
      .sort((a, b) => b.units_sold - a.units_sold).slice(0, 5);
    
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.columns = [
      {header: 'Total Sales', key: 'total_sales', width: 15, font: {bold: true}},
      {header: 'Total Orders', key: 'total_orders', width: 15, font: {bold: true}},
      {header: 'Cancelled Orders', key: 'cancelled_orders', width: 15, font: {bold: true}},
      {header: 'Sales Per Order', key: 'sales_per_order', width: 15, font: {bold: true}},
      {header: 'Total Customers', key: 'total_customers', width: 15, font: {bold: true}},
      {header: 'Existing Customers', key: 'existing_customers', width: 15, font: {bold: true}},
      {header: 'New Customers', key: 'new_customers', width: 15, font: {bold: true}},
      {header: 'Returning Rate', key: 'returning_rate', width: 15, font: {bold: true}},
      {header: 'Sales Percentage Diff', key: 'sales_percentage_diff', width: 15, font: {bold: true}},
      {header: 'Orders Percentage Diff', key: 'orders_percentage_diff', width: 15, font: {bold: true}},
      {header: 'Cancelled Orders Percentage Diff', key: 'cancelled_orders_percentage_diff', width: 15, font: {bold: true}},
      {header: 'Sales Per Order Percentage Diff', key: 'sales_per_order_percentage_diff', width: 15, font: {bold: true}},
      {header: 'Customers Percentage Diff', key: 'customers_percentage_diff', width: 15, font: {bold: true}},
      {header: 'Existing Customers Percentage Diff', key: 'existing_customers_percentage_diff', width: 15, font: {bold: true}},
      {header: 'New Customers Percentage Diff', key: 'new_customers_percentage_diff', width: 15, font: {bold: true}},
      {header: 'Returning Rate Percentage Diff', key: 'returning_rate_percentage_diff', width: 15, font: {bold: true}},
    ];

    worksheet.addRow({
      total_sales: new Intl.NumberFormat(
        "vi-VN",
        { style: "currency", currency: "VND" }
      ).format(totalSales),
      total_orders: totalOrders,
      cancelled_orders: totalCancelledOrders,
      sales_per_order: new Intl.NumberFormat(
        "vi-VN",
        { style: "currency", currency: "VND" }
      ).format(salesPerOrder),
      total_customers: totalCustomers,
      existing_customers: existingCustomers,
      new_customers: newCustomers,
      returning_rate: returningRate,
      sales_percentage_diff: salesPercentageDiff,
      orders_percentage_diff: ordersPercentageDiff,
      cancelled_orders_percentage_diff: cancelledOrdersPercentageDiff,
      sales_per_order_percentage_diff: salesPerOrderPercentageDiff,
      customers_percentage_diff: totalCustomersPercentageDiff,
      existing_customers_percentage_diff: existingCustomersPercentageDiff,
      new_customers_percentage_diff: newCustomersPercentageDiff,
      returning_rate_percentage_diff: returningRatePercentageDiff,
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `sales-report-${startDate.toLocaleDateString()}-${endDate.toLocaleDateString()}.xlsx`
    );

    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);
  } catch (error) {
    next(error);
  }
}
