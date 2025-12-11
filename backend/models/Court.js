const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Court = sequelize.define('Court', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  type: { type: DataTypes.ENUM('indoor', 'outdoor'), allowNull: false },
  basePrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 10.00 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Court;