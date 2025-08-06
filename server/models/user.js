"use strict";

const bcrypt = require("bcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "posts",
      });

      User.hasMany(models.Follows, {
        foreignKey: "fromUser",
        as: "following",
      });

      User.hasMany(models.Follows, {
        foreignKey: "toUser",
        as: "followed",
      });

      User.hasMany(models.Like, {
        foreignKey: "userId",
        as: "likes",
      });

      User.hasMany(models.Comment, {
        foreignKey: "userId",
        as: "comments",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user, options) => {
          user.email = user.email.toLowerCase();
          user.password = await bcrypt.hash(user.password, 10);
          user.alias = user.alias.trim().toLowerCase();
        },
        beforeUpdate: async (user, options) => {
          if (user.changed("email")) {
            user.email = user.email.toLowerCase();
          }
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
          if (user.changed("alias")) {
            user.alias = user.alias.trim().toLowerCase();
          }
        },
      },
    }
  );
  return User;
};
