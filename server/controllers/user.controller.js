// const User = require("../models/User")
import User from "../models/User.js"

const getUser = async (req, res, next) => {
  try {
    // get all users
    const users = await User.find()
    res.json(users)
  
  } catch (err){
    next(err)
  }
}

export {
  getUser
}