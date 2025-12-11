const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Equipment = sequelize.define('Equipment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
  pricePerUnit: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 5.00 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Equipment;