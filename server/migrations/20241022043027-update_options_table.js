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

    await queryInterface.removeColumn('options', 'name');
    await queryInterface.removeColumn('options', 'value');  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.addColumn('options', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.addColumn('options', 'value', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
  }
};
