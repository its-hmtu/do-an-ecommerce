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
    

    await queryInterface.addColumn('orders', 'status', {
      type: Sequelize.ENUM('pending', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    });


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('orders', 'status');
    await queryInterface.removeColumn('orders', 'refund_date');
    await queryInterface.removeColumn('orders', 'cancel_date');
  }
};
