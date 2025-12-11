const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PricingRule = sequelize.define('PricingRule', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  type: { type: DataTypes.ENUM('multiplier', 'surcharge'), allowNull: false }, 
  value: { type: DataTypes.FLOAT, allowNull: false },
  
  appliesToType: { type: DataTypes.ENUM('court', 'coach', 'equipment', 'time'), allowNull: false },
  targetValue: { type: DataTypes.STRING, allowNull: true },
  startTime: { type: DataTypes.STRING, allowNull: true },
  endTime: { type: DataTypes.STRING, allowNull: true },
  
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = PricingRule;