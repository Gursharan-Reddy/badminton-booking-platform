const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  
  courtId: { type: DataTypes.INTEGER, allowNull: false },
  coachId: { type: DataTypes.INTEGER, allowNull: true },
  
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('confirmed', 'cancelled'), defaultValue: 'confirmed' },
  
  rackets: { type: DataTypes.INTEGER, defaultValue: 0 },
  shoes: { type: DataTypes.INTEGER, defaultValue: 0 },
  
  basePrice: { type: DataTypes.FLOAT, allowNull: false },
  pricingBreakdown: { type: DataTypes.JSON, allowNull: false },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
});

module.exports = Booking;