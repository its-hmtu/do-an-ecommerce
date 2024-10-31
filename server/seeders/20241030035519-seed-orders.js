'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert mock address
  
    // Insert mock order
    const orders = await queryInterface.bulkInsert('orders', [{
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
    await queryInterface.bulkInsert('order_items', [
      {
        order_id: 7,
        product_id: 46, 
        user_id: 1,// Assuming product with ID 1 exists
        name: 'Mock Product 1',
        quantity: 2,
        price: 2500000,
        slug: 'mock-product-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        order_id: 7,
        product_id: 45,
        user_id: 1, // Assuming product with ID 2 exists
        name: 'Mock Product 2',
        quantity: 1,
        price: 2500000,
        slug: 'mock-product-2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Delete mock order items
    await queryInterface.bulkDelete('order_items', null, {});

    // Delete mock orders
    await queryInterface.bulkDelete('orders', null, {});

    // Delete mock addresses
    await queryInterface.bulkDelete('addresses', null, {});
  }
};