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
    await queryInterface.addColumn('orders', 'ship_date', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await queryInterface.addColumn('orders', 'delivery_date', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await queryInterface.addColumn('orders', 'payment_date', {
      type: Sequelize.DATE,
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

    await queryInterface.removeColumn('orders', 'ship_date')
    await queryInterface.removeColumn('orders', 'delivery_date')
    await queryInterface.removeColumn('orders', 'payment_date')
  
  }
};
