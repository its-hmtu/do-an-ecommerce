const {
  Order,
  OrderItem,
  Product,
  User,
  ProductImage,
  Option,
  sequelize,
  Address,
  Cart,
  CartItem,
  Sequelize,
  OptionImage,
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
const { generateOrderId } = require("../utils/helper");

exports.createOrder = async (req, res, next) => {
  // const { id } = req.user;
  const id = 1;
  const { items, subtotal, address } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });
  
  try {
    const [newAddress, created] = await Address.findOrCreate({
      where: {
        user_id: id,
        address: address.address,
        city: address.city,
        district: address.district,
        ward: address.ward,
      },
      defaults: {
        user_id: id,
        address: address.address,
        city: address.city,
        district: address.district,
        ward: address.ward,
      },
      transaction,
    });

    const order = await Order.create({
      id: generateOrderId(),
      user_id: id,
      address_id: newAddress.id,
      subtotal,
      status: "pending",
      total: 0,  // Make sure to calculate total later based on shipping, tax, and discount
    }, { transaction });

    console.log(order);  // Add a log to check the created order

    for (let item of items) {
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

      const unitPrice = parseFloat(item.unit_price);
      if (isNaN(unitPrice)) {
        return next(new Error("Invalid unit price"));
      }

      // Create the order item
      await OrderItem.create({
        user_id: id,
        order_id: order.id,
        product_id: item.product_id,
        option_id: item.option_id,
        quantity: item.quantity,
        unit_price: unitPrice,  // Ensure unit_price is a number
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      message: "Order created successfully",
      success: true,
      order_id: order.id,
    });

  } catch (e) {
    await transaction.rollback();
    next(e);  // Log the error for further debugging
  }
};

exports.updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const { address } = req.body;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }

    await order.save();

    res.status(200).json({
      message: "Order updated successfully",
      data: order,
    });
  } catch (e) {
    next(e);
  }
}
 
exports.createCheckoutSession = async (req, res, next) => {
  const { orderId, items, cartId } = req.body;

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "vnd",
      product_data: {
        name: `${item.product_name} - ${item.color}`,
      },
      unit_amount: parseFloat(item.unit_price),
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    payment_method_types: ["card"],
    ui_mode: "embedded",
    return_url: `${process.env.CLIENT_URL}/return?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&cart_id=${cartId}&item_ids=${items.map((item) => item.id).join(",")}`,
  });

  await Order.update({
    payment_method: "credit_card",
    payment_status: "pending",
  }, {
    where: {
      id: orderId,
    },
  });

  res.status(201).json({
    id: session.id,
    clientSecret: session.client_secret,
  });
};

exports.sessionStatus = async (req, res, next) => {
  const { session_id, order_id, cart_id, item_ids } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session) {
      res.status(404);
      return next(new Error("Session not found"));
    }
    console.log(session.status)

    if (session.status === 'complete') {
      await Order.update({
        payment_status: "paid",
        is_paid: true,
        payment_date: new Date(session.created * 1000),
      }, {
        where: {
          id: order_id,
        },
      });

      const cart = await Cart.findByPk(cart_id);
      const itemIds = item_ids.split(",").map((id) => parseInt(id));

      for (let itemId of itemIds) {
        const item = await CartItem.findOne({
          where: {
            id: itemId,
            cart_id: cart_id
          }
        });
        
        const totalItems = cart.total_items - item.quantity;
        cart.total_items = totalItems < 0 ? 0 : totalItems;

        await item.destroy();

        await cart.save();
      }
    }

    res.status(200).json({
      created: new Date(session.created * 1000),
      status: session.status,
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

    if (order.status === "pending" && session.status === "complete") {
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
  // const user_id = req.user.id;
  const user_id = 1
  try {
    const orders = await Order.findAndCountAll({
      where: {
        user_id,
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
                  include: [
                    {
                      model: OptionImage,
                      as: "images",
                      attributes: ["id", "file_path"],
                      required: false,
                    },
                  ],
                  on: {
                    id: { [Sequelize.Op.eq]: Sequelize.col("order_items.option_id") },
                  }
                },
              ],
            },
          ],
        },
      ],
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
    const whereCondition = {};

    if (q) {
      whereCondition.status = {
        [Op.like]: `%${q}%`,
      };
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
                  on: {
                    id: { [Sequelize.Op.eq]: Sequelize.col('order_items.option_id') },
                  },
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
};

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
        },
      ],
    });

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
};

exports.shipOrder = async (req, res, next) => {
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

    if (
      order.status.includes([
        "shipped",
        "delivered",
        "cancelled",
        "completed",
        "refunded",
      ])
    ) {
      res.status(400);
      return next(new Error("Order already shipped"));
    }

    if (order.status === "pending") {
      order.status = "shipped";
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

      const info = await transporter.sendMail(mailOptions);
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    res.status(200).json({
      message: "Order shipped successfully",
      data: order,
    });
  } catch (e) {
    next(e);
  }
};

exports.massShipOrder = async (req, res, next) => {
  const { order_ids } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const orders = await Order.findAll({
      where: {
        id: order_ids,
        status: "pending",
      },
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"],
        },
      ],
    });

    if (orders.length === 0) {
      res.status(404);
      return next(new Error("No order found"));
    }

    for (const order of orders) {
      order.status = "shipped";
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

      const info = await transporter.sendMail(mailOptions);
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
};

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
};

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
};

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
};

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
};

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
      },
    };

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
      console.log("Found ");
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
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);
  } catch (e) {
    next(e);
  }
};
