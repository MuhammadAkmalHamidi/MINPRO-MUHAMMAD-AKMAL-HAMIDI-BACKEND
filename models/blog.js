'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      blog.belongsTo(models.Profile)
      blog.belongsTo(models.category)
      blog.hasMany(models.like)
    }
  }
  blog.init({
    title: {
      type : DataTypes.STRING,
      allowNull : false,
    },
    imgURL: {
      type : DataTypes.STRING,
      allowNull : true,
    },
    content: {
      type : DataTypes.STRING,
      allowNull : false,
    },
    video: {
      type : DataTypes.STRING,
      allowNull : true,
    },
    keyword: {
      type : DataTypes.STRING,
      allowNull : false,
    },
    country: {
      type : DataTypes.STRING,
      allowNull : false,
    }
  }, {
    sequelize,
    modelName: 'blog',
  });
  return blog;
};