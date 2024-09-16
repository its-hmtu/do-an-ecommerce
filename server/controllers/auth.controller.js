// const User = require("../models/User");
// const { generateToken } = require("../utils/token");

import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

const registerUser = async (req, res, next) => {
  try {
    const { user_name, first_name, last_name, email, password } = req.body;
    const user = User.create({
      user_name,
      first_name,
      last_name,
      email,
      password,
      role: "user"
    })

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
}

const loginUser = async (req, res, next) => {
}

export {
  registerUser,
  loginUser
}