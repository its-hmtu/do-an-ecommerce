const e = require("express");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

exports.refresh = async (req, res, next) => {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    res.status(401);
    return next(new Error("Token not provided"));
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: "roles",
    });

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    const newToken = user.generateToken();
    return res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (e) {
    res.status(500);
    return next(e);
  }
};
