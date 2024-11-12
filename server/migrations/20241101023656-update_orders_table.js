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
    await queryInterface.addColumn('orders', 'payment_method', {
      type: Sequelize.ENUM(
        'credit_card',
        'paypal',
        'cash_on_delivery'
      ),
      allowNull: true
    })

    await queryInterface.addColumn('orders', 'payment_status', {
      type: Sequelize.ENUM(
        'pending',
        'paid',
        'failed'
      ),
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('orders', 'payment_method');
    await queryInterface.removeColumn('orders', 'payment_status');
  }
};
