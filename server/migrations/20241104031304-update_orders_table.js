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
    // change column name
    await queryInterface.renameColumn('orders', 'total_price', 'total');
    await queryInterface.addColumn('orders', 'subtotal', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('orders', 'tax', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('orders', 'shipping', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('orders', 'discount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.renameColumn('order_items', 'price', 'unit_price');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('orders', 'total', 'total_price');
    await queryInterface.removeColumn('orders', 'subtotal');
    await queryInterface.removeColumn('orders', 'tax');
    await queryInterface.removeColumn('orders', 'shipping');
    await queryInterface.removeColumn('orders', 'discount');
    await queryInterface.renameColumn('order_items', 'unit_price', 'price');
  }
};
