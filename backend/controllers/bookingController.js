const { Op } = require('sequelize');
const { sequelize, Booking, Equipment } = require('../models/index');
const { calculatePrice } = require('./pricingController');

const checkOverlap = async (model, resourceId, startTime, endTime) => {
    const resourceName = model === 'Court' ? 'courtId' : 'coachId';
    
    const existingBooking = await Booking.findOne({
        where: {
            [resourceName]: resourceId,
            status: 'confirmed',
            [Op.or]: [
                { startTime: { [Op.lt]: endTime, [Op.gte]: startTime } }, 
                { endTime: { [Op.gt]: startTime, [Op.lte]: endTime } }, 
                { [Op.and]: [{ startTime: { [Op.lte]: startTime } }, { endTime: { [Op.gte]: endTime } }] },
            ],
        },
    });
    return existingBooking ? false : true;
};

const checkEquipmentAvailability = async (startTime, endTime, requiredRackets, requiredShoes) => {
    const racketInfo = await Equipment.findOne({ where: { name: 'Rackets' } });
    const shoeInfo = await Equipment.findOne({ where: { name: 'Shoes' } });

    const overlapQuery = {
        where: { 
            status: 'confirmed',
            [Op.or]: [
                { startTime: { [Op.lt]: endTime, [Op.gte]: startTime } }, 
                { endTime: { [Op.gt]: startTime, [Op.lte]: endTime } }, 
                { [Op.and]: [{ startTime: { [Op.lte]: startTime } }, { endTime: { [Op.gte]: endTime } }] },
            ],
        }
    };

    const totalBookedRackets = await Booking.sum('rackets', overlapQuery);
    const totalBookedShoes = await Booking.sum('shoes', overlapQuery);

    if (requiredRackets > (racketInfo.stock - totalBookedRackets)) {
        throw new Error('Not enough rackets available for this slot.');
    }
    if (requiredShoes > (shoeInfo.stock - totalBookedShoes)) {
        throw new Error('Not enough shoes available for this slot.');
    }
};

exports.createBooking = async (req, res, next) => {
    const { courtId, coachId, rackets, shoes, startTime, endTime, userId = 1 } = req.body;

    try {
        const isCourtAvailable = await checkOverlap('Court', courtId, startTime, endTime);
        if (!isCourtAvailable) {
            return res.status(400).json({ message: 'Court is already booked for this time.' });
        }

        if (coachId) {
            const isCoachAvailable = await checkOverlap('Coach', coachId, startTime, endTime);
            if (!isCoachAvailable) {
                return res.status(400).json({ message: 'Coach is unavailable for this time.' });
            }
        }
        
        await checkEquipmentAvailability(startTime, endTime, rackets, shoes);
        
        const priceDetails = await calculatePrice(req.body);

        const newBooking = await sequelize.transaction(async (t) => {
            const booking = await Booking.create({
                courtId,
                userId,
                coachId,
                rackets,
                shoes,
                startTime,
                endTime,
                basePrice: priceDetails.basePrice,
                pricingBreakdown: priceDetails.breakdown,
                totalPrice: priceDetails.total,
                status: 'confirmed'
            }, { transaction: t });
            
            return booking;
        });

        res.status(201).json({ message: 'Booking successful!', booking: newBooking });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.listBookings = async (req, res, next) => {
    try {
        // In a real app, this should only return bookings for the authenticated req.user.id
        const bookings = await Booking.findAll({ where: { userId: req.user.id } });
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};