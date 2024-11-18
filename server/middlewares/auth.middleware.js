const jwt = require('jsonwebtoken');
const { Role, User} = require('../models');


exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401)
    return next(new Error("Token not provided"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      return next(new Error("Invalid token"))
    }
    // console.log(decoded);
    req.user = decoded;
    next();
  });
}

exports.isAdmin = (req, res, next) => {
  if (req.user === null) {
    res.status(403);
    return next(new Error("Permission denied. You're not logged in"));
  }
    if (req.user.roles.some(role => role.name == 'ADMIN')) {
      next();
    } else {
      res.status(403);
      return next(new Error("Permission denied. You're not an admin"));
    }
}

const getFreshUser = (required) => {
  return async (req, res, next) => {
    if (req.user === null || req.user.id === null) {
      if (required) {
        res.status(403);
        return next(new Error("Permission denied"));
      } else {
        return next();
      }
    }
    try {
      const user = await User.findOne({
        where: {id: req.user.id},
        include: [Role],
        attributes: { exclude: ['password'] }
      })
  
      if (!user) {
        res.status(404);
        return next(new Error("User not found"));
      } else {
        req.user = user;
        // console.log("ROLE!@#", req.user.roles.some(role => role.name == 'ADMIN'));
        next();
      }
    } catch (e) {
      res.status(500);
      return next(e);
    }
  }
}

exports.isAuthenticated = (req, res, next) => {
  if (req.user != null) {
    return next();
  }
  res.status(403);
  return next(new Error("Permission denied"));
}

exports.mustBeAuthenticated = [this.verifyToken, getFreshUser(true)];
exports.loadUser = [this.verifyToken, getFreshUser(false)];