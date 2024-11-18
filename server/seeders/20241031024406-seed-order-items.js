'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const orderItems = await queryInterface.bulkInsert('order_items', [
      {
        order_id: '2410ZIMGK7UH',
        user_id: 1,
        product_id: 46,
        name: 'Product 1',
        quantity: 2,
        price: 500000,
        slug: 'product-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        order_id: '2410ZIMGK7UH',
        user_id: 1,
        product_id: 46,
        name: 'Product 2',
        quantity: 1,
        price: 200000,
        slug: 'product-2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: ['id'] });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('order_items', null, {});
  }
};
