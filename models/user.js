const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: true
  },
  surname: {
    type: Sequelize.STRING,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  resetToken: {
    type: Sequelize.STRING,
  },
  resetTokenExpiry: {
    type: Sequelize.DATE,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  },
  password: {
    type: Sequelize.STRING,
  },
  SignUpDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
});


module.exports = User;