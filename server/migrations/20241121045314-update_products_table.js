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
    await queryInterface.addColumn('products', 'special_base_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    })

    await queryInterface.addColumn('products', 'special_price_start', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await queryInterface.addColumn('products', 'special_price_end', {
      type: Sequelize.DATE,
      allowNull: true
    })

    await queryInterface.addColumn('products', 'special_base_price_percentage', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    })

    await queryInterface.addColumn('options', 'special_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    })

    await queryInterface.addColumn('options', 'special_price_percentage', {
      type: Sequelize.DECIMAL(10, 2),
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

    await queryInterface.removeColumn('products', 'special_base_price')
    await queryInterface.removeColumn('products', 'special_price_start')
    await queryInterface.removeColumn('products', 'special_price_end')
    await queryInterface.removeColumn('products', 'special_base_price_percentage')

    await queryInterface.removeColumn('options', 'special_price')
    await queryInterface.removeColumn('options', 'special_price_percentage')
  }
};
