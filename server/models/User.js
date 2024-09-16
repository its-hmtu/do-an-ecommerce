// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const slugify = require('slugify');

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_name: {
    type: String,
    required: [true, 'User name is required'],
    unique: true,
  },
  first_name: {
    type: String,
    required: [true, 'First name is required']
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  phone_number: {
    type: String,
    // required: [true, 'Phone number is required']
    default: ""
  },
  address: {
    type: String,
    // required: [true, 'Address is required']
    default: ""
  },
  profile_image_url: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  path: {
    type: String,
    default: ""
  }
},
{
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  } 

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.path = slugify(this.user_name, { lower: true, strict: true });
})

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

export default mongoose.model('User', UserSchema);