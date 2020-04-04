const Pok = require('../models/pok');

exports.createPok = async (req, res, next) => {
    const { title, isPrivate, content } = req.body;
    const pok = new Pok({title, content, isPrivate});

    try {
        await pok.save();
        console.log('pok saved!');
        res.status(201).json({
            message: 'Pok created successfully!',
            pok
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getPok = async (req, res, next) => {
    const pokId = req.params.pokId;
    try {
        const pok = await Pok.findById(pokId);
        if (!pok) {
            const error = new Error('Could not find pok');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({pok});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getPoks = async (req, res, next) => {
    try {
        const poks = await Pok.find({});
        res.status(200).json({poks});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}