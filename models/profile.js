'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.hasOne(models.blog)
      Profile.hasMany(models.like)
    }
  }
  Profile.init({
    username: {
      type: DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    email: {
      type: DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    password: {
      type: DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    isVerify : {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    },
    ImgProfile : {
      type : DataTypes.STRING,
      allowNull : true
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};