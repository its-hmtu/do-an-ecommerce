// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

export {
  generateToken
}