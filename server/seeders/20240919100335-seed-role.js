'use strict';
const bcrypt = require('bcryptjs');
const User = require('../models').User;
const Role = require('../models').Role;
const UserRole = require('../models').UserRole;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const [role, created] = await Role.findOrCreate({
        where: { name: 'USER' },
        defaults: { description: 'For users' },
      });

    } catch (err) {
      console.error(err);
      process.exit(0);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await Role.destroy({
        where: { name: 'USER' },
      });
      console.log('Role USER deleted successfully');
    } catch (err) {
      console.error(err);
    }
  }
};