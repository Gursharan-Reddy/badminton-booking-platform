const { Court, PricingRule, Coach, Equipment } = require('../models/index');

const isTimeWithinRule = (rule, hour) => {
    if (!rule.startTime || !rule.endTime) return true;
    
    const startHour = parseInt(rule.startTime.split(':')[0], 10);
    const endHour = parseInt(rule.endTime.split(':')[0], 10);

    return hour >= startHour && hour < endHour;
};

exports.calculatePrice = async ({ courtId, coachId, rackets, shoes, startTime, endTime }) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    const court = await Court.findByPk(courtId);
    const coach = coachId ? await Coach.findByPk(coachId) : null;
    const rules = await PricingRule.findAll({ where: { isActive: true } });

    if (!court) throw new Error("Court not found.");

    let finalPrice = court.basePrice * durationHours;
    const dayOfWeek = start.getDay(); 
    const hour = start.getHours();
    
    const racketInfo = await Equipment.findOne({ where: { name: 'Rackets' } });
    const shoeInfo = await Equipment.findOne({ where: { name: 'Shoes' } });

    const resourceFees = {
        rackets: rackets * (racketInfo ? racketInfo.pricePerUnit : 5.00),
        shoes: shoes * (shoeInfo ? shoeInfo.pricePerUnit : 5.00),
        coach: coach ? coach.hourlyRate * durationHours : 0
    };

    const breakdown = {
        baseCourtPrice: court.basePrice * durationHours,
        resourceFees,
        ruleAdjustments: []
    };
    
    const courtRules = rules.filter(r => r.appliesToType === 'court' && r.targetValue === court.type);
    const timeRules = rules.filter(r => r.appliesToType === 'time');
    
    const allApplicableRules = [...courtRules, ...timeRules];

    for (const rule of allApplicableRules) {
        let apply = true;

        if (rule.appliesToType === 'time') {
            const isWeekendRule = rule.targetValue === 'weekend' && (dayOfWeek === 0 || dayOfWeek === 6);
            const isPeakHourRule = rule.targetValue === 'peak_hour' && isTimeWithinRule(rule, hour);
            
            if (!isWeekendRule && !isPeakHourRule) {
                apply = false;
            }
        }
        
        if (apply) {
            let adjustment = 0;
            if (rule.type === 'multiplier') {
                adjustment = finalPrice * (rule.value - 1);
                finalPrice *= rule.value;
            } else if (rule.type === 'surcharge') {
                adjustment = rule.value * durationHours;
                finalPrice += adjustment;
            }
            
            breakdown.ruleAdjustments.push({
                name: rule.name,
                type: rule.type,
                adjustment: parseFloat(adjustment.toFixed(2))
            });
        }
    }

    const totalResourceFees = resourceFees.rackets + resourceFees.shoes + resourceFees.coach;
    finalPrice += totalResourceFees;

    return {
        total: parseFloat(finalPrice.toFixed(2)),
        breakdown,
        basePrice: breakdown.baseCourtPrice
    };
};

exports.getPriceCheck = async (req, res, next) => {
    try {
        const priceDetails = await exports.calculatePrice(req.body);
        res.json(priceDetails);
    } catch (error) {
        next(error);
    }
};

exports.addRule = async (req, res, next) => {
    try {
        const rule = await PricingRule.create(req.body);
        res.status(201).json(rule);
    } catch (error) {
        next(error);
    }
};

exports.updateRule = async (req, res, next) => {
    try {
        const [updated] = await PricingRule.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedRule = await PricingRule.findByPk(req.params.id);
            return res.json(updatedRule);
        }
        throw new Error('Pricing Rule not found');
    } catch (error) {
        next(error);
    }
};