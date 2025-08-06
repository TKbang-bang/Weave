"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follows extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Follows.belongsTo(models.User, {
        foreignKey: "fromUser",
        as: "following",
      });

      Follows.belongsTo(models.User, {
        foreignKey: "toUser",
        as: "followed",
      });
    }
  }
  Follows.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fromUser: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      toUser: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Follows",
    }
  );
  return Follows;
};
