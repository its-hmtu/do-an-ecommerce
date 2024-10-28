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
    await queryInterface.addColumn('products', 'colors', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [
        {
          name: 'Black',
          value: '#000000'
        }
      ]
    })

    await queryInterface.addColumn('products', 'sizes', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [{
        size: 'S',
        quantity: 0
      }]
    })

    await queryInterface.addColumn('products', 'availability', {
      type: Sequelize.ENUM('in-stock', 'out-of-stock'),
      allowNull: false,
      defaultValue: 'in-stock'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('products', 'colors')
    await queryInterface.removeColumn('products', 'sizes')
    await queryInterface.removeColumn('products', 'availability')
  }
};
