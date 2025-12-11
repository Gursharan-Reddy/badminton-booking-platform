const { Equipment } = require('../models/index');

exports.listEquipment = async (req, res, next) => {
    try {
        const equipment = await Equipment.findAll({ where: { isActive: true } });
        res.json(equipment);
    } catch (error) {
        next(error);
    }
};

exports.updateEquipmentStock = async (req, res, next) => {
    try {
        const { stock, pricePerUnit } = req.body;
        const [updated] = await Equipment.update({ stock, pricePerUnit }, { where: { name: req.params.name } });
        if (updated) {
            const updatedItem = await Equipment.findOne({ where: { name: req.params.name } });
            return res.json(updatedItem);
        }
        throw new Error('Equipment item not found');
    } catch (error) {
        next(error);
    }
};