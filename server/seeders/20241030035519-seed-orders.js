'use strict';
const { v4: UUIDV4 } = require('uuid');
const { generateOrderId } = require('../utils/helper');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert mock address
  
    // Insert mock order
    const orders = await queryInterface.bulkInsert('orders', [{
      id: generateOrderId(),
      user_id: 1, // Assuming user with ID 1 exists
      total_price: 5000000,
      status: 'pending',
      tracking_number: null,
      address_id: 1, // Use the correct address_id
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: ['id'] });

    // // Use the correct order_id from the inserted order

    // Insert mock order items
   
  },

  async down(queryInterface, Sequelize) {
    // Delete mock order items
    // await queryInterface.bulkDelete('order_items', null, {});

    // Delete mock orders
    await queryInterface.bulkDelete('orders', null, {});

    // Delete mock addresses
    // await queryInterface.bulkDelete('addresses', null, {});
  }
};