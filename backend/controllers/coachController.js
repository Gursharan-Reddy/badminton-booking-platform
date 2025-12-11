const { Coach } = require('../models/index');

exports.listCoaches = async (req, res, next) => {
    try {
        const coaches = await Coach.findAll({ where: { isAvailable: true } });
        res.json(coaches);
    } catch (error) {
        next(error);
    }
};

exports.addCoach = async (req, res, next) => {
    try {
        const coach = await Coach.create(req.body);
        res.status(201).json(coach);
    } catch (error) {
        next(error);
    }
};

exports.updateCoach = async (req, res, next) => {
    try {
        const [updated] = await Coach.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedCoach = await Coach.findByPk(req.params.id);
            return res.json(updatedCoach);
        }
        throw new Error('Coach not found');
    } catch (error) {
        next(error);
    }
};