const { User, Role } = require("../models");
const sanitizeInput = require("../utils/sanitize").sanitizeInput;

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "Email is required", status: 400 });
  }
  if (!password || password.trim() === "") {
    return res.status(400).json({ message: "Password is required", status: 400 });
  }
  try {
    const admin = await User.findOne({
      where: {
        email,
      },
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password", status: 400 });
    } else {
      if (admin.isValidPassword(password) === false) {
        return res.status(400).json({ message: "Invalid email or password", status: 400 });
      }

      if (!admin.isAdmin()) {
        return res
          .status(403)
          .json({ message: "Forbidden. You're not an admin!", status: 403 });
      }
    }

    const token = await admin.generateToken();
    const refresh = await admin.generateRefreshToken();
    res.cookie("da_refresh", refresh, {
      httpOnly: true,
      secure: true, // Ensure this is true if using SameSite=None
      sameSite: "None", // Correct value for sameSite
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: "Login successful", status: 200, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", status: 500});
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll();
    return res.status(200).json({ message: "Roles retrieved", success: true, roles });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", success: false });
  }
}

exports.createRole = async (req, res, next) => {
  const {name, description} = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Role name is required", success: false });
  }

  try {
    const role = await Role.create({
      name: sanitizeInput(name.trim()),
      description: sanitizeInput(description.trim()),
    });

    return res.status(201).json({ message: "Role created", success: true, role });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", success: false });
  }
}
