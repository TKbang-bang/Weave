"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Save extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Save.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Save.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
      });
    }
  }
  Save.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Save",
    }
  );
  return Save;
};
