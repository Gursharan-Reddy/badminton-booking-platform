const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Coach = sequelize.define('Coach', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  hourlyRate: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 20.00 },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Coach;