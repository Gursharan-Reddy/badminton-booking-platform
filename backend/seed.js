const { sequelize, Court, Coach, PricingRule, Equipment, User } = require('./models/index');
require('dotenv').config({ path: './.env' });
const bcrypt = require('bcryptjs');

const seedDB = async () => {
    try {
        await sequelize.sync({ force: true });
        
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);

        await User.bulkCreate([
            { id: 1, name: 'Test User', email: 'user@example.com', password: await bcrypt.hash('password123', salt), role: 'user' },
            { id: 2, name: 'Admin Account', email: 'admin@example.com', password: adminPassword, role: 'admin' },
        ]);

        await Court.bulkCreate([
            { name: 'Court 1', type: 'indoor', basePrice: 15.00, isActive: true },
            { name: 'Court 2', type: 'indoor', basePrice: 15.00, isActive: true },
            { name: 'Court 3', type: 'outdoor', basePrice: 10.00, isActive: true },
            { name: 'Court 4', type: 'outdoor', basePrice: 10.00, isActive: true },
        ]);

        await Coach.bulkCreate([
            { name: 'Coach Alex', hourlyRate: 30.00, isAvailable: true },
            { name: 'Coach Ben', hourlyRate: 25.00, isAvailable: true },
            { name: 'Coach Chris', hourlyRate: 35.00, isAvailable: true },
        ]);
        
        await Equipment.bulkCreate([
            { name: 'Rackets', stock: 20, pricePerUnit: 5.00, isActive: true },
            { name: 'Shoes', stock: 15, pricePerUnit: 4.00, isActive: true },
        ]);

        await PricingRule.bulkCreate([
            { name: 'Weekend Multiplier', type: 'multiplier', value: 1.2, appliesToType: 'time', targetValue: 'weekend', isActive: true },
            { name: 'Peak Hour Multiplier', type: 'multiplier', value: 1.5, appliesToType: 'time', targetValue: 'peak_hour', startTime: '18:00', endTime: '21:00', isActive: true },
            { name: 'Indoor Premium', type: 'surcharge', value: 5.00, appliesToType: 'court', targetValue: 'indoor', isActive: true },
        ]);

    } catch (error) {
        console.error('SEEDING ERROR:', error);
        process.exit(1);
    }
};

seedDB();