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

    await queryInterface.addColumn('orders', 'guest_email', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await queryInterface.addColumn('orders', 'guest_first_name', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await queryInterface.addColumn('orders', 'guest_last_name', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await queryInterface.addColumn('orders', 'guest_phone', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await queryInterface.addColumn('orders', 'guest_address', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('orders', 'guest_email')
    await queryInterface.removeColumn('orders', 'guest_first_name')
    await queryInterface.removeColumn('orders', 'guest_last_name')
    await queryInterface.removeColumn('orders', 'guest_phone')
    await queryInterface.removeColumn('orders', 'guest_address')
  }
};
