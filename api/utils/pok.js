const Pok = require('../models/pok');

exports.errorHandler = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}

exports.getPokUtil = async (pokId) => {
    const pok = await Pok.findById(pokId);
    if (!pok) {
        const error = new Error('Could not find pok');
        error.statusCode = 404;
        throw error;
    }
    return pok;
}