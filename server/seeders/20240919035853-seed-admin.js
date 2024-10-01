'use strict';
const bcrypt = require('bcryptjs');
const User = require('../models').User;
const Role = require('../models').Role;
const UserRole = require('../models').UserRole;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await Role.findOrCreate({
        where: { name: 'USER' },
        defaults: { description: 'For regular users' },
      })
      const [role, created] = await Role.findOrCreate({
        where: { name: 'ADMIN' },
        defaults: { description: 'For Admin users' },
      });

      const [user, userCreated] = await User.findOrCreate({
        where: { username: 'admin' },
        include: [Role],
        defaults: {
          first_name: process.env.ADMIN_FNAME || 'Tu',
          last_name: process.env.ADMIN_LNAME || 'Hoang',
          is_email_verified: true,
          phone: process.env.ADMIN_PHONE || '123456789',
          email: process.env.ADMIN_EMAIL || 'tu.hoangminh15@gmail.com',
          password: 'admin123'
        }
      });

      const isAdmin = await user.isAdmin();
      if (!isAdmin) {
        await user.setRoles([role]);
        console.log('[+] associated role=ADMIN to admin');
      }
    } catch (err) {
      console.error(err);
      process.exit(0);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await User.destroy({
        where: { username: 'admin' },
      });
      console.log('Admin deleted successfully');
    } catch (err) {
      console.error(err);
    }
  }
};