const Sequelize = require('sequelize');
require('dotenv').config();


const options = {
  dialect: 'mysql',
  host: 'localhost',
}


const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);


module.exports = sequelize;