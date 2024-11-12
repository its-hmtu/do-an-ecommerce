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
    await queryInterface.removeColumn('order_items', 'name')
    await queryInterface.removeColumn('order_items', 'slug')
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('order_items', 'name', {
      type: Sequelize.STRING,
      allowNull: false
    })

    await queryInterface.addColumn('order_items', 'slug', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
};
