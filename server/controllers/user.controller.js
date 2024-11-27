const { col } = require('sequelize');
const {User, Role, UserRole, Cart, CartItem, Product, Option, Sequelize, ProductImage, OptionImage} = require('../models');
const Op = require('sequelize').Op;
const sanitizeInput = require('../utils/sanitize').sanitizeInput;

exports.register = async (req, res, next) => {
  const {email, password, confirm_password,username, first_name, last_name} = req.body;
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  if (!username || username.trim() === '') {
    res.status(400)
    return next(new Error('Username is required'));
  } 
  if (!first_name || first_name.trim() === '') {
    res.status(400)
    return next(new Error('First name is required'));
  }
  if (!last_name || last_name.trim() === '') {
    res.status(400)
    return next(new Error('Last name is required'));
  }

  if (!email || email.trim() === '') {
    res.status(400)
    return next(new Error('Email is required'));
  }

  if (!emailRegex.test(email)) {
    res.status(400)
    return next(new Error('Invalid email address'));
  }

  if (!password || password.trim() === '') {
    res.status(400)
    return next(new Error('Password is required'));
  }

  if (!confirm_password || confirm_password.trim() === '') {
    res.status(400)
    return next(new Error('Confirm password is required'));
  }

  if (password !== confirm_password) {
    res.status(400)
    return next(new Error('Passwords do not match'));
  }

  if (password.length < 6) {
    res.status(400)
    return next(new Error('Password must be at least 6 characters'));
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }]
    }
  });

  if (user) {
    if (user.email === email) {
      res.status(400)
      return next(new Error('Email already exists'));
    }
    if (user.username === username) {
      res.status(400)
      return next(new Error('Username already exists'));
    }
  }

  try {
    const newUser = await User.create({
      username: sanitizeInput(username),
      first_name: sanitizeInput(first_name),
      last_name: sanitizeInput(last_name),
      email: sanitizeInput(email),
      password: sanitizeInput(password),
    });

    const userRole = await Role.findOne({
      where: { name: 'USER' }
    })
    
    if (userRole) {
      await newUser.addRole(userRole);
    }

    return res.status(201).json({ message: 'User created successfully', user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      // include the role of the user get from the userRole variable
      roles: [userRole.name]
    }});
  } catch (e) {
    return res.status(500).json({ message: 'An error occurred', error: e.message });
  }
}

exports.login = async (req, res) => {
  const {email, password} = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Username is required' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ message: 'Password is required' });
  }

  const user = await User.findOne({
    where: {
      email: sanitizeInput(email)
    },
    include: [
      {
        model: Role,
        attributes: ['name'],
      }
    ]
  })

  if (!user) {
    return res.status(404).json({ message: 'Invaid email or password' });
  } else {
    const isValidPassword = await user.isValidPassword(sanitizeInput(password));
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  }

  const token = user.generateToken();
  const refresh_token = user.generateRefreshToken();

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(200).json({ message: 'Login successful', token });
}

exports.logout = async (req, res) => {
  res.clearCookie('refresh_token');
  return res.status(200).json({ message: 'Logout successful' });
}

exports.getUserData = async (req, res, next) => {
  return res.status(200).json({ user: req.user });
}

exports.getUserCart = async (req, res, next) => {
  // const {id} = req.user;
  const id = 1;
  const cart = await Cart.findOne({
    where: { user_id: id },
    include: [
      {
        model: CartItem,
        as: 'items',
        attributes: ['id', 'quantity', 'product_id', 'option_id'],
        include: [
          {
            model: Product,
            attributes: {
              exclude: ['product_description']
            },
           
            include: [
              {
                model: Option,
                attributes: ['id', 'color', 'price'],
                required: false,
                on: {
                  id: { [Sequelize.Op.eq]: Sequelize.col('items.option_id') },
                },
                include: [
                  {
                    model: OptionImage,
                    as: 'images',
                    attributes: ['id', 'file_path'],
                    required: false,
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  return res.status(200).json({ cart });
}

exports.addToCart = async (req, res, next) => {
  // const {id} = req.user;
 const id = 1;
  const {product_id, quantity, option_id} = req.body;

  const product = await Product.findByPk(product_id);

  if (!product) {
    res.status(404);
    return next(new Error('Product not found'));
  }

  if (!quantity || quantity < 1) {
    res.status(400);
    return next(new Error('Quantity is required'));
  }

  const cart = await Cart.findOrCreate({
    where: { user_id: id },
    defaults: { user_id: id }
  });

  const cartItem = await CartItem.findOne({
    where: {
      cart_id: cart[0].id,
      product_id,
      option_id
    }
  });

  if (cartItem) {
    cartItem.quantity += parseInt(quantity);
    cartItem.save();
  } else {
    await CartItem.create({
      cart_id: cart[0].id,
      product_id,
      option_id,
      quantity
    });
  }

  return res.status(200).json({ message: 'Product added to cart' });
}

exports.updateCartItem = async (req, res, next) => {
  // const {id} = req.user;
  const id = 1;
  const {item_id, quantity} = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    return next(new Error('Quantity is required'));
  }

  const cartItem = await CartItem.findOne({
    where: {
      id: item_id,
      cart_id: id
    }
  });

  if (!cartItem) {
    res.status(404);
    return next(new Error('Item not found'));
  }

  cartItem.quantity = quantity;
  cartItem.save();

  return res.status(200).json({ message: 'Cart item updated' });
}

exports.removeFromCart = async (req, res, next) => {
  // const {id} = req.user;
  const id = 1;
  const {item_id} = req.body;

  const cartItem = await CartItem.findOne({
    where: {
      id: item_id,
      cart_id: id
    }
  });

  if (!cartItem) {
    res.status(404);
    return next(new Error('Item not found'));
  }

  cartItem.destroy();

  return res.status(200).json({ message: 'Cart item removed' });
}