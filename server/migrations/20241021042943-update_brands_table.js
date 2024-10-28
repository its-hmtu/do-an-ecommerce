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

    await queryInterface.addColumn('brands', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    });

    await queryInterface.addColumn('brands', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('brands', 'createdAt');
    await queryInterface.removeColumn('brands', 'updatedAt');
  }
};
