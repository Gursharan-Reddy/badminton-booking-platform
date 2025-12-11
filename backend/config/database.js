// /backend/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || 'db/booking.sqlite',
  logging: false,
});

const connectDB = async () => {
  try {
    require('../models/index');
    await sequelize.authenticate();
    await sequelize.sync({ force: false }); 
  } catch (error) {
    console.error('Unable to connect or sync the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };