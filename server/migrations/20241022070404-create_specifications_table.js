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
    await queryInterface.createTable('specifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'brands',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      storage_capacity: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      number_of_cameras: {
        type: Sequelize.SMALLINT,
        allowNull: true
      },
      camera_resolution: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      ram: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      rom: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      battery_capacity: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      processor: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      screen_size: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      operating_system: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      dimensions: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      cable_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      sim_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      manufacture_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      warranty_duration: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      condition: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('specifications');
  }
};
