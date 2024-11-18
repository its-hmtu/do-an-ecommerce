const { User, Role, sequelize } = require("../models");
const sanitizeInput = require("../utils/sanitize").sanitizeInput;

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email.trim() === "") {
    res.status(400);
    return next(new Error("Email is required"));
  }
  if (!password || password.trim() === "") {
    res.status(400);
    return next(new Error("Password is required"));
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
      res.status(400);
      return next(new Error("Invalid email or password"));
    } else {
      if (admin.isValidPassword(password) === false) {
        res.status(400);
        return next(new Error("Invalid email or password"));
      }

      if (!admin.isAdmin()) {
        res.status(403);
        return next(new Error("Unauthorized"));
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
    res.status(500);
    return next(error);
  }
};

exports.getCurrentAdmin = async (req, res, next) => {
  const { user } = req;

  return res.status(200).json({ message: "Admin retrieved", success: true, user });
}

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll();
    return res.status(200).json({ message: "Roles retrieved", success: true, roles });
  } catch (error) {
    res.status(500);
    return next(error);
  }
}

exports.createRole = async (req, res, next) => {
  const {name, description} = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  if (!name || name.trim() === "") {
    res.status(400);
    return next(new Error("Role name is required"));
  }

  try {
    const role = await Role.findOne({
      where: {
        name: sanitizeInput(name.trim()),
      }
    });

    if (role) {
      await transaction.rollback();
      res.status(400);
      return next(new Error("Role already exists"));
    }

    const newRole = await Role.create({
      name: sanitizeInput(name.trim()),
      description: sanitizeInput(description.trim()),
    }, {
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({ message: "Role created", success: true, role: newRole });
  } catch (error) {
    await transaction.rollback();
    res.status(500);
    return next(error);
  }
}

exports.updateRole = async (req, res, next) => {
  const { id } = req.params;
  const {name, description} = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  if (!name || name.trim() === "") {
    res.status(400);
    return next(new Error("Role name is required"));
  }

  try {
    const role = await Role.findByPk(id);
    if (!role) {
      await transaction.rollback();
      res.status(404);
      return next(new Error("Role not found"));
    }

    role.name = sanitizeInput(name.trim()) || role.name;
    role.description = sanitizeInput(description.trim()) || role.description;
    await role.save();
    await transaction.commit();

    return res.status(200).json({ message: "Role updated", success: true, role });
  } catch (error) {
    // console.log(error.stack);
    // return res.status(500).json({ message: "An error occurred", success: false });
    await transaction.rollback();
    res.status(500);
    return next(error);
  }
}

exports.deleteRole = async (req, res, next) => {
  const {id} = req.params;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const role = await Role.findByPk(id);
    if (!role) {
      await transaction.rollback();
      res.status(404);
      return next(new Error("Role not found"));
    }

    await role.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({ message: "Role deleted", success: true });
  } catch (error) {
    await transaction.rollback();
    res.status(500);
    return next(error);
  }
}

exports.logout = async (req, res, next) => {
  res.clearCookie("da_refresh");
  return res.status(200).json({ message: "Logout successful", success: true });
}
