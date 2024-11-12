const schedule = require("node-schedule");
const { Order, User, sequelize } = require("../models");
const transporter = require("../config/mailer");
const { Op } = require("sequelize");
const moment = require("moment");

const updateOrderToDelivered = async (order) => {
  const transaction = await sequelize.transaction();
  try {
    order.status = "delivered";
    order.delivery_date = new Date();
    await order.save({ transaction });
    const mailOptions = {
      from: process.env.EMAIL,
      to: order.user.email || order.guest_email,
      subject: "Order Delivered",
      html: `<p>Dear ${order.guest_first_name || order.user.first_name},</p>
        <p>Your order with ID ${order.id} has been delivered.</p>
        <p>Thank you for shopping with us!</p>
        <a
          style="
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
          "
          onclick="window.location.href='http://localhost:3000/orders/${order.id}/confirm
        >Confirm delivery</button>
        <p>Best regards,</p>
        <p>Your Company Name</p>`,
    }

    await transporter.sendMail(mailOptions);
    await transaction.commit();

    console.log("Order delivered: ", order.id);
  } catch (e) {
    await transaction.rollback();
    console.log(e);
  }
} 

const orderToDeliveredUpdater = {
  start: () => {
    schedule.scheduleJob("*/5 * * * * *", async () => {
      try {
        const orders = await Order.findAll({
          where: {
            status: "shipped",
            ship_date: {
              [Op.lte]: new Date(new Date() - 5 * 60 * 1000),
            },
          },
          include: [
            {
              model: User,
              attributes: ["email", "first_name", "last_name"],
            },
          ],
        });
      
        orders.forEach(async (order) => {
          await updateOrderToDelivered(order);
        });
      } catch (e) {
        console.log(e);
      }
    });
  }
}

const orderToCompleteUpdater = {
  start: () => {
    schedule.scheduleJob("*/5 * * * * *", async () => {
      try {
        const orders = await Order.findAll({
          where: {
            status: "delivered",
            delivery_date: {
              [Op.lte]: moment().subtract(3, "days").toDate(),
            },
          },
        });

        orders.forEach(async (order) => {
          order.status = "completed";
          await order.save();
          console.log("Order completed: ", order.id);
        });
      } catch (e) {
        console.log(e);
      }
    });
  }
}


module.exports = {
  orderToDeliveredUpdater,
  orderToCompleteUpdater,
};