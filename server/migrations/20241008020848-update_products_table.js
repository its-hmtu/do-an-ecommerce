'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn('products', 'stock', 'total_in_stock');
    await queryInterface.renameColumn('products', 'price', 'base_price');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.renameColumn('products', 'total_in_stock', 'stock');
    await queryInterface.renameColumn('products', 'base_price', 'price');
  }
};
