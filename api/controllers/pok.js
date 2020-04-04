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