const {
  Order,
  OrderItem,
  Product,
  User,
  ProductImage,
  Option,
  sequelize,
  Address,
} = require("../models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Op } = require("sequelize");
// const {
//   client: redisClient,
//   REDIS_CACHE_5_MINUTES,
// } = require("../config/redis");
const transporter = require("../config/mailer");
const nodemailer = require("nodemailer");
const { generateTrackingOrder } = require("../utils/helper");
const exceljs = require("exceljs");
const moment = require("moment");

exports.createOrder = async (req, res, next) => {
  const { user_id, address_id, items, guest } = req.body;

  try {
    if (!guest && user_id !== req.user.id) {
      res.status(403);
      return next(new Error("Unauthorized"));
    }

    let order;

    if (guest) {
      const user = await User.findOne({
        where: {
          email: guest.email,
        },
      });

      if (user) {
        res.status(400);
        return next(new Error("Email already exists"));
      }

      order = await Order.create({
        // payment_method: guest.payment_method,
        status: "pending",
        guest_email: guest.email,
        guest_first_name: guest.first_name,
        guest_last_name: guest.last_name,
        guest_phone: guest.phone,
        guest_address: guest.address,
        total: 0,
      });
    } else {
      order = await Order.create({
        user_id,
        address_id,
        status: "pending",
        total: 0,
      });
    }

    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        res.status(404);
        return next(new Error("Product not found"));
      }
      const option = await Option.findByPk(item.option_id);
      if (item.option_id && !option) {
        res.status(404);
        return next(new Error("Option not found"));
      }
      const variationPrice = item.option_id ? option.price : product.base_price;

      const orderItemPrice = variationPrice * item.quantity;

      const orderItem = await OrderItem.create({
        user_id,
        order_id: order.id,
        product_id: item.product_id,
        option_id: item.option_id,
        quantity: item.quantity,
        unit_price: orderItemPrice,
      });

      subtotal += orderItemPrice;
    }

    order.subtotal = subtotal;
    order.total = subtotal + order.shipping + order.tax + order.discount;
    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      data: order,
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

// exports.createCheckoutSession = async (req, res, next) => {
//   const { order_id, payment_method } = req.body;

//   try {
//     const order = await Order.findByPk(order_id, {
//       include: [OrderItem],
//     });

//     if (!order) {
//       res.status(404);
//       return next(new Error("Order not found"));
//     }

//     const lineItems = order.order_items.map((item) => ({
//       price_data: {
//         currency: "vnd",
//         product_data: {
//           name: item.product.product_name,
//         },
//         unit_amount: item.unit_price * 100,
//       },
//       quantity: item.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       line_itmes: lineItems,
//       payment_method_types: ["card"],
//       ui_mode: "embedded",
//       success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`,
//     });

//     await Order.update(
//       {
//         // payment_intent_id: session.payment_intent,
//         payment_status: "pending",
//         payment_method: "credit_card",
//       },
//       {
//         where: {
//           id: order.id,
//         },
//       }
//     );

//     res.status(201)
//       .json({ id: session.id, client_secret: session.client_secret });
//   } catch (e) {
//     next(e);
//   }
// };

exports.createCheckoutSession = async (req, res, next) => {
  const lineItems = {
    price_data: {
      currency: "vnd",
      product_data: {
        name: 'T-shirt',
      },
      unit_amount: 10000 * 100,
    },
    quantity: 1,
  };
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [lineItems],
    mode: "payment",
    return_url: `${process.env.CLIENT_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  console.log(session);

  res.send({ client_secret: session.client_secret });
};

exports.sessionStatus = async (req, res, next) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    console.log(session);

    if (!session) {
      res.status(404);
      return next(new Error("Session not found"));
    }

    res.status(200).json({
      created: new Date(session.created * 1000),
      status: session.status,
      customer_email: session.customer_email,
    });
  } catch (e) {
    next(e);
  }
};

// update order after payment is successful
exports.updateOrderPaid = async (req, res, next) => {
  const { id } = req.params;
  const { session } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const order = await Order.findOne({
      where: {
        id: id,
      },
    });

    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }

    if (order.status === "pending" && session.status === 'complete') {
      order.is_paid = true;
      order.payment_date = new Date(session.created * 1000);
    }
    
    await order.save({ transaction });
    res.status(200).json({
      message: "Order updated successfully",
      data: order,
    });
  } catch (e) {
    next(e);
  }
};

exports.getUserOrders = async (req, res, next) => {
  const user_id = req.user.id;

  try {
    const orders = await Order.findAndCountAll({
      where: {
        user_id,
      },
      include: [OrderItem],
    });

    res.status(200).json({
      data: orders.rows,
      total: orders.count,
    });
  } catch (e) {
    next(e);
  }
};

exports.getOrders = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 10;
  const order = req.query.order || "DESC";
  const q = req.query.q || null;
  const sort = req.query.sort || "createdAt";
  const offset = (page - 1) * pageSize;
  const isPaid = req.query.is_paid || null;

  try {
    const whereCondition = {
     
    }

    if (q) {
      whereCondition.status = {
        [Op.like]: `%${q}%`,
      }
    }

    if (isPaid) {
      whereCondition.is_paid = isPaid;
    }
    
    const orders = await Order.findAndCountAll({
      where: whereCondition,
      // exclude: ['tracking_number'],
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["id", "file_path"],
                  required: false,
                },
                {
                  model: Option,
                  as: "options",
                  required: false,
                },
              ],
            },
          ],
          required: false,
        },
        {
          model: User,
          attributes: ["id", "username", "email", "first_name", "last_name"],
          required: false,
        },
      ],
      order: [[sort, order]],
      offset,
      limit: pageSize,
      distinct: true,
    });

    const pagination = {
      current_page: page,
      page_size: pageSize,
      total_items: orders.count,
      total_pages: Math.ceil(orders.count / pageSize),
    };

    // await redisClient.setEx(
    //   req.originalUrl,
    //   REDIS_CACHE_5_MINUTES,
    //   JSON.stringify({
    //     data: orders.rows,
    //     ...pagination,
    //   })
    // );

    res.status(200).json({
      data: orders.rows,
      total: orders.count,
      ...pagination,
    });
  } catch (e) {
    next(e);
  }
};

exports.getOrdersByStatus = async (req, res, next) => {
  const { q: status } = req.query;
  try {
    const orders = await Order.findAll({
      where: {
        status: status,
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["id", "file_path"],
                  required: false,
                },
                {
                  model: Option,
                  as: "options",
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "username", "email", "first_name", "last_name"],
          required: true,
        },
      ],
    });

    res.status(200).json({
      message: "Orders retrieved successfully",
      success: true,
      data: orders,
      total: orders.length,
    });
  } catch (e) {
    next(e);
  }
}

exports.getSingleOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["id", "file_path"],
                  required: false,
                },
                {
                  model: Option,
                  as: "options",
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "username", "email", "first_name", "last_name"],
          required: true,
        },
        {
          model: Address,
          // as: "shipping_address",
          // attributes: { exclude: ["user_id"] },
          required: false,
        }
      ],
    })
  
    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }

    // await redisClient.setEx(
    //   req.originalUrl,
    //   REDIS_CACHE_5_MINUTES,
    //   JSON.stringify({
    //     data: order,
    //   })
    // );

    res.status(200).json({
      message: "Order retrieved successfully",
      success: true,
      data: order,
    });

  } catch (e) {
    next(e);
  }
}

exports.shipOrder = async (req, res, next) => {
  const {order_id} = req.query;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const order = await Order.findOne({
      where: {
        id: order_id,
      },
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"],
        },
      ]
    })

    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }

    if (order.status.includes(["shipped", "delivered", "cancelled", "completed", "refunded"])) {
      res.status(400);
      return next(new Error("Order already shipped"));
    }

    if (order.status === 'pending') {
      order.status = 'shipped';
      order.tracking_number = generateTrackingOrder();
      order.ship_date = new Date();
      await order.save({ transaction });
      await transaction.commit();
      // await redisClient.del(`/api/orders`);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.user.email,
        subject: "Order Shipped",
        text: `Dear ${order.guest_first_name || order.user.first_name},

        Your order with ID ${order.id} has been shipped.
    
        Thank you for shopping with us!
    
        Best regards,
        Your Company Name`,
      };

      const info = await transporter.sendMail(mailOptions)
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
    }

    res.status(200).json({
      message: "Order shipped successfully",
      data: order,
    });

  } catch (e) {
    next(e);
  }
}

exports.massShipOrder = async (req, res, next) => {
  const {order_ids} = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const orders = await Order.findAll({
      where: {
        id: order_ids,
        status: 'pending'
      }, 
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"],
        },
      ]
    })

    if (orders.length === 0) {
      res.status(404);
      return next(new Error("No order found"));
    }

    for (const order of orders) {
      order.status = 'shipped';
      order.tracking_number = generateTrackingOrder();
      order.ship_date = new Date();
      await order.save({ transaction });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.user.email,
        subject: "Order Shipped",
        text: `Dear ${order.guest_first_name || order.user.first_name},

        Your order with ID ${order.id} has been shipped.
    
        Thank you for shopping with us!
    
        Best regards,
        Your Company Name`,
      };

      const info = await transporter.sendMail(mailOptions)
    }

    await transaction.commit();

    res.status(200).json({
      message: "Orders shipped successfully",
      data: orders,
    });

  } catch (e) {
    await transaction.rollback();
    next(e);
  }
}

exports.completeOrder = async (req, res, next) => {
  const { order_id } = req.query;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const order = await Order.findOne({
      where: {
        id: order_id,
      },
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"],
        },
      ],
    });

    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }

    if (order.status === "completed") {
      res.status(400);
      return next(new Error("Order already completed"));
    }

    if (order.status === "delivered") {
      order.status = "completed";
      await order.save({ transaction });
      await transaction.commit();
      // await redisClient.del(req.originalUrl);
    }

    res.status(200).json({
      message: "Order completed successfully",
      data: order,
    });
  } catch (e) {
    next(e);
  }
}

exports.cancelOrder = async (req, res, next) => {
  const { order_id } = req.query;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const order = await Order.findOne({
      where: {
        id: order_id,
      },
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"],
        },
      ],
    });

    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }

    if (order.status === "cancelled") {
      res.status(400);
      return next(new Error("Order already cancelled"));
    }

    if (order.status === "pending") {
      order.status = "cancelled";
      await order.save({ transaction });
      await transaction.commit();
      // await redisClient.del(req.originalUrl);
    }

    res.status(200).json({
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (e) {
    next(e);
  }
}

exports.refundOrder = async (req, res, next) => {
  const { order_id } = req.query;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const order = await Order.findOne({
      where: {
        id: order_id,
      },
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"],
        },
      ],
    });

    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }

    if (order.status === "refunded") {
      res.status(400);
      return next(new Error("Order already refunded"));
    }

    if (order.status === "shipped" || order.status === "delivered") {
      order.status = "refunded";
      await order.save({ transaction });
      await transaction.commit();
      // await redisClient.del(req.originalUrl);
    }

    res.status(200).json({
      message: "Order refunded successfully",
      data: order,
    });
  } catch (e) {
    next(e);
  }
}

exports.completeOrder = async (req, res, next) => {
  const { order_id } = req.query;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const order = await Order.findOne({
      where: {
        id: order_id,
      },
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"],
        },
      ],
    });

    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }

    if (order.status === "completed") {
      res.status(400);
      return next(new Error("Order already completed"));
    }

    if (order.status === "delivered") {
      order.status = "completed";
      await order.save({ transaction });
      await transaction.commit();
      // await redisClient.del(req.originalUrl);
    }

    res.status(200).json({
      message: "Order completed successfully",
      data: order,
    });
  } catch (e) {
    next(e);
  }
}

exports.exportOrdersToExcel = async (req, res, next) => {
  const { status, paid } = req.query;
  const { start_date, end_date } = req.query;
  try {
    const startDate = moment(start_date).startOf("day").toDate();
    const endDate = moment(end_date).endOf("day").toDate();
    console.log(startDate, endDate);

    const where = {
      status: {
        [Op.like]: `%${status}%`,
      }      
    }

    if (start_date && end_date) {
      where.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    if (paid) {
      where.is_paid = paid;
    }

    const orders = await Order.findAll({
      where: where,
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["id", "file_path"],
                  required: false,
                },
                {
                  model: Option,
                  as: "options",
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    if (orders.length > 0) {
      console.log('Found ')
    }

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "Order ID", key: "id", width: 10 },
      { header: "Status", key: "status", width: 20 },
      { header: "Tracking Number", key: "tracking_number", width: 20 },
      { header: "Payment Method", key: "payment_method", width: 20 },
      { header: "Payment Status", key: "payment_status", width: 20 },
      { header: "Is Paid", key: "is_paid", width: 20 },
      { header: "Total", key: "total", width: 10 },
      { header: "Subtotal", key: "subtotal", width: 20 },
      { header: "Shipping", key: "shipping", width: 20 },
      { header: "Tax", key: "tax", width: 20 },
      { header: "Discount", key: "discount", width: 20 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
      { header: "Ship Date", key: "ship_date", width: 20 },
      { header: "Payment Date", key: "payment_date", width: 20 },
      { header: "Cancel Date", key: "cancel_date", width: 20 },
      { header: "Refund Date", key: "refund_date", width: 20 },
      { header: "User ID", key: "user_id", width: 20 },
      { header: "Guest Email", key: "guest_email", width: 20 },
      { header: "Guest First Name", key: "guest_first_name", width: 20 },
      { header: "Guest Last Name", key: "guest_last_name", width: 20 },
      { header: "Guest Address", key: "guest_address", width: 20 },
      { header: "Guest Phone", key: "guest_phone", width: 20 },
    ];

    orders.forEach((order) => {
      worksheet.addRow({
        id: order.id,
        total: order.total,
        status: order.status,
        tracking_number: order.tracking_number,
        guest_email: order.guest_email,
        guest_first_name: order.guest_first_name,
        guest_last_name: order.guest_last_name,
        guest_address: order.guest_address,
        guest_phone: order.guest_phone,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        shipping: order.shipping,
        tax: order.tax,
        discount: order.discount,
        subtotal: order.subtotal,
        user_id: order.user_id,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        ship_date: order.ship_date,
        payment_date: order.payment_date,
        cancel_date: order.cancel_date,
        refund_date: order.refund_date,
        is_paid: order.is_paid,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=orders.xlsx"
    );

    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);
  } catch (e) {
    next(e);
  }
};