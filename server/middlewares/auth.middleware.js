const jwt = require('jsonwebtoken');
const { Role, User} = require('../models');


exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // console.log(decoded);
    req.user = decoded;
    next();
  });
}

exports.isAdmin = (req, res, next) => {
  if (req.user === null) {
    return res.status(403).json({ message: "Forbidden. You're not logged in!" });
  }
    if (req.user.roles.some(role => role.name == 'ADMIN')) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden. You're not an admin!" });
    }
}

const getFreshUser = (required) => {
  return async (req, res, next) => {
    if (req.user === null || req.user.id === null) {
      if (required) {
        return res.status(403).json({ message: "Permission denied" });
      } else {
        return next();
      }
    }
    try {
      const user = await User.findOne({
        where: {id: req.user.id},
        include: [Role]
      })
  
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = user;
        // console.log("ROLE!@#", req.user.roles.some(role => role.name == 'ADMIN'));
        next();
      }
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

exports.isAuthenticated = (req, res, next) => {
  if (req.user != null) {
    return next();
  }
  return res.status(403).json({ message: "Permission denied" });
}

exports.mustBeAuthenticated = [this.verifyToken, getFreshUser(true)];
exports.loadUser = [this.verifyToken, getFreshUser(false)];