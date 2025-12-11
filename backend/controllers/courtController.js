const { Court } = require('../models/index');

exports.listCourts = async (req, res, next) => {
    try {
        const courts = await Court.findAll({ where: { isActive: true } });
        res.json(courts);
    } catch (error) {
        next(error);
    }
};

exports.addCourt = async (req, res, next) => {
    try {
        const court = await Court.create(req.body);
        res.status(201).json(court);
    } catch (error) {
        next(error);
    }
};

exports.updateCourt = async (req, res, next) => {
    try {
        const [updated] = await Court.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedCourt = await Court.findByPk(req.params.id);
            return res.json(updatedCourt);
        }
        throw new Error('Court not found');
    } catch (error) {
        next(error);
    }
};