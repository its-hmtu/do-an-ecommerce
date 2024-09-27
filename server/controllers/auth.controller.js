const { User } = require("../models");
const jwt = require("jsonwebtoken");

exports.refresh = async (req, res, next) => {
  const refresh_token = req.cookies["da_refresh"];
  if (!refresh_token) {
    return res
      .status(401)
      .json({ message: "Refresh token not provided", success: false });
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: "roles",
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const newToken = user.generateToken();
    return res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message, success: false });
  }
};
