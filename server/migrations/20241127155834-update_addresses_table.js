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
    await queryInterface.addColumn('addresses', 'district', {
      type: Sequelize.STRING(15),
      allowNull: false
    });

    await queryInterface.addColumn('addresses', 'ward', {
      type: Sequelize.STRING(15),
      allowNull: false
    })

    await queryInterface.removeColumn('addresses', 'province');
    await queryInterface.removeColumn('addresses', 'postal_code');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('addresses', 'district');
    await queryInterface.removeColumn('addresses', 'ward');

    await queryInterface.addColumn('addresses', 'province', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn('addresses', 'postal_code', {
      type: Sequelize.STRING(10),
      allowNull: false
    });
  }
};
