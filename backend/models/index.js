const { sequelize } = require('../config/database');
const Court = require('./Court');
const Coach = require('./Coach');
const PricingRule = require('./PricingRule');
const Booking = require('./Booking');
const User = require('./User');
const Equipment = require('./Equipment');

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Court.hasMany(Booking, { foreignKey: 'courtId' });
Booking.belongsTo(Court, { foreignKey: 'courtId' });

Coach.hasMany(Booking, { foreignKey: 'coachId' });
Booking.belongsTo(Coach, { foreignKey: 'coachId' });

module.exports = {
  Court,
  Coach,
  PricingRule,
  Booking,
  User,
  Equipment,
  sequelize,
};