
const e = require('express');
const {
  Order,
  OrderItem,
  Product,
  User
} = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Op } = require('sequelize');

exports.createOrder = async (req, res, next) => {
  const { user_id, address_id, items } = req.body;

  try {
    const order = await Order.create({
      user_id,
      address_id,
      total_price: 0,
      status: 'pending'
    })

    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        res.status(404)
        return next(new Error('Product not found'));
      }

      const orderItem = await OrderItem.create({
        order_id: order.id,
        user_id,
        product_id: item.product_id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        slug: product.slug
      })

      totalPrice += product.price * item.quantity;
    }

    order.total_price = totalPrice;
    await order.save();

    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
}

exports.createCheckoutSession = async (req, res, next) => {
  const { order_id } = req.body;

  try {
    const order = await Order.findByPk(order_id, {
      include: [OrderItem]
    })

    if (!order) {
      res.status(404)
      return next(new Error('Order not found'));
    }

    const lineItems = order.OrderItems.map(item => ({
      price_data: {
        currency: 'vnd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_itmes: lineItems,
      payment_method_types: ['card'],
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`
    })

    res.status(201).json({ id: session.id });
  } catch (e) {
    next(e);
  }
}

exports.sessionStatus = async (req, res, next) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.status(200).json(session);
  } catch (e) {
    next(e);
  }
}

exports.webhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    res.status(400)
    return next(e);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const order = await Order.findByPk(session.client_reference_id);

      order.status = 'processing';
      await order.save();

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}

exports.getUserOrders = async (req, res, next) => {
  const user_id = req.user.id;
  
  try {
    const orders = await Order.findAndCountAll({
      where: {
        user_id
      },
      include: [OrderItem]
    });

    res.status(200).json({
      data: orders.rows,
      total: orders.count
    });
  } catch (e) {
    next(e);
  }
}

// get orders invoices to admin can view

exports.getOrders = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 10;
  const order = req.query.order || "DESC";
  const q = req.query.q || "";
  // const category = req.query.category || "";
  const sort = req.query.sort || "createdAt";
  const offset = (page - 1) * pageSize;

  try {
    const orders = await Order.findAndCountAll({
      where: {
        status: {
          [Op.like]: `%${q}%`
        }
      },
      // exclude: ['tracking_number'],
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User,
          attributes: ['id', 'username', 'email', 'first_name', 'last_name']
        }
      ],
      order: [[sort, order]],
      offset,
      limit: pageSize
    });

    const pagination = {
      current_page: page,
      page_size: pageSize,
      total_items: orders.count,
      total_pages: Math.ceil(orders.count / pageSize)
    }
    
    res.status(200).json({
      data: orders.rows,
      ...pagination
    });
  } catch (e) {
    next(e);
  }
}