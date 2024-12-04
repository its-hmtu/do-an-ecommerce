const {
  User,
  Role,
  UserRole,
  Cart,
  CartItem,
  Product,
  Option,
  Sequelize,
  ProductImage,
  OptionImage,
  Address,
  sequelize,
} = require("../models");
const transporter = require("../config/mailer");
const Op = require("sequelize").Op;
const sanitizeInput = require("../utils/sanitize").sanitizeInput;
const nodemailer = require("nodemailer");

exports.register = async (req, res, next) => {
  const { email, password, confirm_password, username, first_name, last_name } =
    req.body;
  const transaction = await sequelize.transaction();
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!username || username.trim() === "") {
    res.status(400);
    return next(new Error("Username is required"));
  }
  if (!first_name || first_name.trim() === "") {
    res.status(400);
    return next(new Error("First name is required"));
  }
  if (!last_name || last_name.trim() === "") {
    res.status(400);
    return next(new Error("Last name is required"));
  }

  if (!email || email.trim() === "") {
    res.status(400);
    return next(new Error("Email is required"));
  }

  if (!emailRegex.test(email)) {
    res.status(400);
    return next(new Error("Invalid email address"));
  }

  if (!password || password.trim() === "") {
    res.status(400);
    return next(new Error("Password is required"));
  }

  if (!confirm_password || confirm_password.trim() === "") {
    res.status(400);
    return next(new Error("Confirm password is required"));
  }

  if (password !== confirm_password) {
    res.status(400);
    return next(new Error("Passwords do not match"));
  }

  if (password.length < 6) {
    res.status(400);
    return next(new Error("Password must be at least 6 characters"));
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });

  if (user) {
    if (user.email === email) {
      res.status(400);
      return next(new Error("Email already exists"));
    }
    if (user.username === username) {
      res.status(400);
      return next(new Error("Username already exists"));
    }
  }

  try {
    const newUser = await User.create({
      username: sanitizeInput(username),
      first_name: sanitizeInput(first_name),
      last_name: sanitizeInput(last_name),
      email: sanitizeInput(email),
      password: sanitizeInput(password),
      is_email_verified: false,
    });

    const userRole = await Role.findOne({
      where: { name: "USER" },
    });

    if (userRole) {
      await newUser.addRole(userRole);
    }

    const emailConfirmCode = newUser.generateEmailConfirmCode();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Verify your email address",
      text: `Dear ${newUser.first_name} ${newUser.last_name},
      Thank you for registering with us. Please use the following code to verify your email address: ${emailConfirmCode}
      Best regards,
      Your Company Name`,
      html: `<p>Dear ${newUser.first_name} ${newUser.last_name},</p>
      <p>Thank you for registering with us. Please use the following code to verify your email address: <strong>${emailConfirmCode}</strong></p>
      <p>Best regards,</p>
      <p>Your Company Name</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return res
      .status(201)
      .json({
        message: "User created successfully",
        success: true,
        email: newUser.email,
      });
  } catch (e) {
    await transaction.rollback();
    return next(e);
  }
};

exports.emailVerify = async (req, res, next) => {
  const { email, code } = req.body;

  if (!email || email.trim() === "") {
    res.status(400);
    return next(new Error("Email is required"));
  }

  if (!code || code.trim() === "") {
    res.status(400);
    return next(new Error("Verification code is required"));
  }

  const user = await User.findOne({
    where: {
      email: sanitizeInput(email),
      email_confirm_code: sanitizeInput(code),
    },
  });

  if (!user) {
    res.status(404);
    return next(new Error("User not found"));
  }

  user.is_email_verified = true;
  user.email_confirm_code = null;
  await user.save();

  return res.status(200).json({ message: "Email verified", success: true });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "Username is required" });
  }

  if (!password || password.trim() === "") {
    return res.status(400).json({ message: "Password is required" });
  }

  const user = await User.findOne({
    where: {
      email: sanitizeInput(email),
    },
    include: [
      {
        model: Role,
        attributes: ["name"],
      },
    ],
  });

  if (!user) {
    return res.status(404).json({ message: "Invaid email or password" });
  } else {
    const isValidPassword = await user.isValidPassword(sanitizeInput(password));
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  }

  const token = user.generateToken();
  const refresh_token = user.generateRefreshToken();

  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.clearCookie("session_id");

  return res.status(200).json({ message: "Login successful", token });
};

exports.logout = async (req, res) => {
  res.clearCookie("refresh_token");
  res.clearCookie("session_id");
  return res.status(200).json({ message: "Logout successful" });
};

exports.getUserData = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findOne({
    where: { id },
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: Address,
        as: "addresses",
      },
    ],
  });

  return res.status(200).json({ user });
};

exports.changeUserInfo = async (req, res, next) => {
  try {
    const { id } = req.user;
  const { first_name, last_name, email, phone, username } = req.body;

  const user = await User.findOne({
    where: { id },
  });

  if (!user) {
    res.status(404);
    return next(new Error("User not found"));
  }

  // email is currently cannot be changed
  if (username) {
    const existing = await User.findOne({
      where: { username, id: { [Op.ne]: id } },
    });

    if (existing) {
      res.status(400);
      return next(new Error("Username already exists"));
    }

  }

  await user.update({
    first_name: first_name || user.first_name,
    last_name: last_name || user.last_name,
    phone: phone || user.phone,
    username: username || user.username,
  });
  
  return res.status(200).json({ message: "User info updated", success: true });
  } catch (e) {
    next(e);
  }

}

exports.changePassword = async (req, res, next) => {
  try {
    const {id} = req.user;
    const {old_password, new_password, confirm_password} = req.body;

    if (!old_password || old_password.trim() === "") {
      res.status(400);
      return next(new Error("Old password is required"));
    }

    if (!new_password || new_password.trim() === "") {
      res.status(400);
      return next(new Error("New password is required"));
    }

    if (!confirm_password || confirm_password.trim() === "") {
      res.status(400);
      return next(new Error("Confirm password is required"));
    }

    if (new_password !== confirm_password) {
      res.status(400);
      return next(new Error("Passwords do not match"));
    }

    if (new_password.length < 6) {
      res.status(400);
      return next(new Error("Password must be at least 6 characters"));
    }

    if (new_password === old_password) {
      res.status(400);
      return next(new Error("New password must be different from the old password"));
    }

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    const isValidPassword = await user.isValidPassword(old_password);

    if (!isValidPassword) {
      res.status(401);
      return next(new Error("Invalid password"));
    }

    const hash = await user.encryptePassword(new_password);
    
    user.password = hash;
    await user.save();

    return res.status(200).json({ message: "Password changed", success: true });
  } catch (e) {
    next(e)
  }
}

exports.getUserCart = async (req, res, next) => {
  // const {id} = req.user;
  const id = 1;
  const cart = await Cart.findOne({
    where: { user_id: id },
    include: [
      {
        model: CartItem,
        as: "items",
        attributes: ["id", "quantity", "product_id", "option_id"],
        include: [
          {
            model: Product,
            attributes: {
              exclude: [
                "product_description",
                "total_in_stock",
                "availability",
                "views",
                "featured",
                "sales",
              ],
            },

            include: [
              {
                model: Option,
                attributes: ["id", "color", "price"],
                required: false,
                on: {
                  id: { [Sequelize.Op.eq]: Sequelize.col("items.option_id") },
                },
                include: [
                  {
                    model: OptionImage,
                    as: "images",
                    attributes: ["id", "file_path"],
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  return res.status(200).json({ cart });
};

exports.addToCart = async (req, res, next) => {
  // const { id } = req.user;
  const id = 1;
  const { product_id, quantity, option_id } = req.body;

  const product = await Product.findByPk(product_id);

  if (!product) {
    res.status(404);
    return next(new Error("Product not found"));
  }

  if (!quantity || quantity < 1) {
    res.status(400);
    return next(new Error("Quantity is required"));
  }

  // Find or create the cart for the user
  const [cart, created] = await Cart.findOrCreate({
    where: { user_id: id },
    defaults: { user_id: id },
  });

  // Find the cart item for the specific product and option
  const cartItem = await CartItem.findOne({
    where: {
      cart_id: cart.id,
      product_id,
      option_id,
    },
  });

  if (cartItem) {
    // If the item exists, set the new quantity (overwrite the old one)
    cartItem.quantity = parseInt(quantity); // Set new quantity
    await cartItem.save();
  } else {
    // If the item doesn't exist, create a new cart item
    await CartItem.create({
      cart_id: cart.id,
      product_id,
      option_id,
      quantity,
    });
  }

  // Re-fetch the updated cart items and calculate total_items
  const updatedCartItems = await CartItem.findAll({
    where: { cart_id: cart.id },
  });

  const totalItems = updatedCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Update the total_items in the cart
  cart.total_items = totalItems;
  await cart.save(); // Ensure the cart is saved with the updated total_items

  return res
    .status(200)
    .json({ message: "Product added to cart", totalItems: cart.total_items });
};

exports.updateCartItem = async (req, res, next) => {
  // const {id} = req.user;
  const id = 1;
  const { item_id, quantity, cart_id } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    return next(new Error("Quantity is required"));
  }

  const cart = await Cart.findOne({
    where: { user_id: id },
  });

  const cartItem = await CartItem.findOne({
    where: {
      id: item_id,
      cart_id: cart_id,
    },
  });

  if (!cartItem) {
    res.status(404);
    return next(new Error("Item not found"));
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  const updatedCartItems = await CartItem.findAll({
    where: { cart_id: cart_id },
  });

  const totalItems = updatedCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Update the total_items in the cart
  cart.total_items = totalItems;
  await cart.save();

  return res
    .status(200)
    .json({ message: "Cart item updated", totalItems: cart.total_items });
};

exports.updateCartSubtotal = async (req, res, next) => {
  // const {id} = req.user;
  const id = 1;
  const { subtotal } = req.body;

  if (!subtotal || subtotal < 0) {
    res.status(400);
    return next(new Error("Subtotal is required"));
  }

  const cart = await Cart.findOne({
    where: { user_id: id },
  });

  cart.subtotal = subtotal;
  await cart.save();

  return res.status(200).json({ message: "Cart subtotal updated" });
};

exports.removeFromCart = async (req, res, next) => {
  // const {id} = req.user;
  const id = 1;
  const { ids } = req.body;

  if (!ids || ids.length === 0) {
    res.status(400);
    return next(new Error("Item ids are required"));
  }

  const cart = await Cart.findOne({
    where: { user_id: id },
  });

  const cartItems = await CartItem.findAll({
    where: {
      id: { [Op.in]: ids },
      cart_id: cart.id,
    },
  });

  if (!cartItems || cartItems.length === 0) {
    res.status(404);
    return next(new Error("Items not found"));
  }

  await CartItem.destroy({
    where: {
      id: { [Op.in]: ids },
      cart_id: cart.id,
    },
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.total_items - totalItems < 0) {
    cart.total_items = 0;
  } else {
    cart.total_items -= totalItems;
  }

  await cart.save();
  return res.status(200).json({ message: "Cart item removed" });
};

exports.addAddress = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { address, city, district, ward, is_default } = req.body;

    if (!address || address.trim() === "") {
      res.status(400);
      return next(new Error("Address is required"));
    }

    if (!city || city.trim() === "") {
      res.status(400);
      return next(new Error("City is required"));
    }

    if (!district || district.trim() === "") {
      res.status(400);
      return next(new Error("District is required"));
    }

    if (!ward || ward.trim() === "") {
      res.status(400);
      return next(new Error("Ward is required"));
    }

    const newAddress = await Address.create({
      user_id: id,
      address,
      city,
      district,
      ward,
      is_default,
    });

    if (is_default) {
      const otherAddresses = await Address.findAll({
        where: { user_id: id, id: { [Op.ne]: newAddress.id } },
      });

      await Promise.all(
        otherAddresses.map((address) => {
          address.is_default = false;
          return address.save();
        })
      );
    }

    return res
      .status(201)
      .json({ message: "Address created", success: true });
  } catch (e) {
    next(e);
  }
}

exports.setDefaultAddress = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { addressId } = req.params;

    const address = await Address.findOne(
      {
        where: { id: addressId, user_id: id },
      },
    );

    if (!address) {
      res.status(404);
      return next(new Error("Address not found"));
    }

    await address.update(
      {
        is_default: true,
      },
    );

    const otherAddresses = await Address.findAll(
      {
        where: { user_id: id, id: { [Op.ne]: addressId } },
      },
    );

    await Promise.all(
      otherAddresses.map((address) => {
        address.is_default = false;
        return address.save();
      })
    );

    return res
      .status(200)
      .json({ message: "Default address set", success: true });
  } catch (e) {
    next(e);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { addressId } = req.params;
    const { address, city, district, ward, is_default } = req.body;

    const addressInstance = await Address.findOne(
      {
        where: { id: addressId, user_id: id },
      },
    );

    if (!addressInstance) {
      res.status(404);
      return next(new Error("Address not found"));
    }

    await addressInstance.update(
      {
        address,
        city,
        district,
        ward,
        is_default,
      },
    );

    const otherAddresses = await Address.findAll(
      {
        where: { user_id: id, id: { [Op.ne]: addressId } },
      },
    );

    if (is_default) {
      await Promise.all(
        otherAddresses.map((address) => {
          address.is_default = false;
          return address.save();
        })
      );
    } else {
      // If the address is not set as default, check if there are no default addresses
      const defaultAddress = otherAddresses.find((address) => address.is_default);
      if (!defaultAddress) {
        const newDefaultAddress = otherAddresses[0];
        newDefaultAddress.is_default = true;
        await newDefaultAddress.save();
      }
    }

    return res.status(200).json({ message: "Address updated", success: true });
  } catch (e) {
    next(e);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { addressId } = req.params;

    const address = await Address.findOne({
      where: { id: addressId, user_id: id },
    });

    if (!address) {
      res.status(404);
      return next(new Error("Address not found"));
    }

    if (address.is_default) {
      const otherAddresses = await Address.findAll({
        where: { user_id: id, id: { [Op.ne]: addressId } },
      });

      if (otherAddresses.length > 0) {
        const newDefaultAddress = otherAddresses[0];
        newDefaultAddress.is_default = true;
        await newDefaultAddress.save();
      }
    }

    await address.destroy();

    return res.status(200).json({ message: "Address deleted", success: true });
  } catch (e) {
    next(e);
  }
};

exports.passwordReset = async (req, res, next) => {
  const { email } = req.query;

  if (!email || email.trim() === "") {
    res.status(400);
    return next(new Error("Email is required"));
  }

  const user = await User.findOne({
    where: { email: sanitizeInput(email) },
  });

  let password = "admin123"

  const hash = await user.encryptePassword(password)

  user.password = hash
  await user.save()

  res.status(200).json({ message: "Password reset", password });
}

