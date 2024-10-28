const {User, Role, UserRole} = require('../models');
const Op = require('sequelize').Op;
const sanitizeInput = require('../utils/sanitize').sanitizeInput;

exports.register = async (req, res) => {
  const {email, password, confirm_password,username, first_name, last_name} = req.body;
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  if (!username || username.trim() === '') {
    return res.status(400).json({ message: 'Username is required' });
  } 
  if (!first_name || first_name.trim() === '') {
    return res.status(400).json({message: 'First name is required'});
  }
  if (!last_name || last_name.trim() === '') {
    return res.status(400).json({message: 'Last name is required'});
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (!confirm_password || confirm_password.trim() === '') {
    return res.status(400).json({ message: 'Confirm password is required' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Password and confirm password do not match'});
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }]
    }
  });

  if (user) {
    if (user.email === email) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (user.username === username) {
      return res.status(400).json({ message: 'Username already exists' });
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
  const {user_name, password} = req.body;

  if (!user_name || user_name.trim() === '') {
    return res.status(400).json({ message: 'Username is required' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ message: 'Password is required' });
  }

  const user = await User.findOne({
    where: {
      username: sanitizeInput(user_name)
    },
    include: [
      {
        model: Role,
        attributes: ['name'],
      }
    ]
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  } else {
    const isValidPassword = await user.isValidPassword(sanitizeInput(password));
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }
  }

  const token = user.generateToken();

  return res.status(200).json({ message: 'Login successful', token });
}