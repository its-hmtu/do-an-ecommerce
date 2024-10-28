"use strict";
const { where } = require("sequelize");
const { Category, CategoryImage } = require("../models");
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    try {
      for (let i = 0; i < 10; i++) {
        const category = {
          name: faker.commerce.department(),
          description: faker.commerce.productDescription(),
        };

        const [newCategory, created] = await Category.findOrCreate({
          where: {name: category.name},
          defaults: {description: category.description}
        });
        const images = [];
        
        const image = await CategoryImage.create({
          category_id: newCategory.id,
          file_name: faker.system.fileName(),
          file_path: faker.image.url(),
          mime_type: "image/jpeg",
          original_name: faker.system.fileName(),
          file_size: faker.number.int({ min: 1000, max: 10000 }),
        });

        images.push(image);
        

        newCategory.images = images;
        await newCategory.save();

        console.log(`Category ${category.name} with Id:  created successfully`);
      }
    } catch (e) {
      console.error(e);
      process.exit(0);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    try {
      await Category.destroy({
        where: {},
      });
      console.log("Categories deleted successfully");
    } catch (err) {
      console.error(err);
    }
  },
};
