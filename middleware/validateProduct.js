const ValidationError = require('../errors/ValidationError');

module.exports = function (req, res, next) {
    const { name, description, price, category, inStock } = req.body;
    if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
        return next(new ValidationError('Missing or invalid product fields'));
    }
    next();
};
