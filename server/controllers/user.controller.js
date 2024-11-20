const {User, Role, UserRole} = require('../models');
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