const Pok = require('../models/pok');

const errorHandler = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}

exports.createPok = async (req, res, next) => {
    const { title, isPrivate, content, isDraft, tags, parentPok, childrenPok } = req.body;
    const pok = new Pok({title, content, isPrivate, isDraft, tags, parentPok, childrenPok});

    try {
        await pok.save();
        console.log('pok saved!');
        res.status(201).json({
            message: 'Pok created successfully!',
            pok
        });
    } catch (err) {
        errorHandler(err, next);
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
        errorHandler(err, next);
    }
}

exports.getPoks = async (req, res, next) => {
    try {
        const poks = await Pok.find({});
        res.status(200).json({poks});
    } catch (err) {
        errorHandler(err, next);
    }
}

exports.deletePok = async (req, res, next) => {
    const pokId = req.params.pokId;
    try {
        await Pok.deleteOne({ _id: pokId })
        res.status(200).json({});
    } catch (err) {
        errorHandler(err, next);
    }
}

exports.putPok = async (req, res, next) => {
    const pokId = req.params.pokId;
    const { title, isPrivate, content, isDraft, tags, parentPokId, childrenPok } = req.body;
    try {
        // TODO: make sure not to have circular dependencies
        const pok = await Pok.findById(pokId);
        if (title) pok.title = title;
        if (isPrivate) pok.isPrivate = isPrivate;
        if (content) pok.content = content;
        if (isDraft) pok.isDraft = isDraft;
        if (tags) pok.tags = tags;
        if (parentPokId) {
            const parentPok = await Pok.findById(parentPokId);
            parentPok.childrenPok.push(pok);
            await parentPok.save();
            pok.parentPok = parentPok;
        }
        if (childrenPok) {
            childrenPok.forEach(childPokId => {
                Pok.findById(childPokId).then(childPok => {
                    childPok.parentPok = pok;
                    return childPok.save();
                }).then(result => {
                    return;
                }).catch(err => {
                    errorHandler(err, next);
                })
            });
            pok.childrenPok = childrenPok;
        }
        await pok.save();
        res.status(200).json({pok});
    } catch (err) {
        errorHandler(err, next);
    }
}