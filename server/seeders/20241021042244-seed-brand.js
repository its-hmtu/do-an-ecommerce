'use strict';

const { name } = require('ejs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('brands', [
      {
        name: 'Apple',
        slug: 'apple'
      },
      {
        name: 'Samsung',
        slug: 'samsung'
      },
      {
        name: 'Xiaomi',
        slug: 'xiaomi'
      },
      {
        name: 'Oppo',
        slug: 'oppo'
      },
      {
        name: 'Vivo',
        slug: 'vivo'
      },
      {
        name: 'Realme',
        slug: 'realme'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('brands', null, {});
  }
};
