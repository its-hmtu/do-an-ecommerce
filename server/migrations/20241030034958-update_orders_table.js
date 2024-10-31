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
    await queryInterface.addColumn('orders', 'tracking_number', {
      type: Sequelize.STRING,
      allowNull: true
    })

    await queryInterface.addColumn('orders', 'address_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('orders', 'tracking_number')
    await queryInterface.removeColumn('orders', 'address_id')
  }
};
