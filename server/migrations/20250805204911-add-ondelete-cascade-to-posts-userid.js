"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.removeConstraint("Posts", "Posts_userId_fkey");

    await queryInterface.addConstraint("Posts", {
      fields: ["userId"],
      type: "foreign key",
      name: "Posts_userId_fkey",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeConstraint("Posts", "Posts_userId_fkey");

    await queryInterface.addConstraint("Posts", {
      fields: ["userId"],
      type: "foreign key",
      name: "Posts_userId_fkey",
      references: {
        table: "Users",
        field: "id",
      },
    });
  },
};
