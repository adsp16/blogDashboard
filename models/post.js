const Sequelize = require('sequelize');
const sequelizeDB = require('../util/database');


const Post = sequelizeDB.define('post', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  user: {
    type: Sequelize.STRING,
  },
  title: {
    type: Sequelize.STRING,
  },
  category: {
    type: Sequelize.STRING
  },
  image: {
    type: Sequelize.STRING,
  },
  postbody: {
    type: Sequelize.TEXT,
  },
  author: {
    type: Sequelize.STRING,
  },
  featuredpost: {
    type: Sequelize.STRING,
  },
  homepagepost: {
    type: Sequelize.STRING,
  }
});

module.exports = Post;