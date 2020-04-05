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
    // for now filter is text only, but we should probably have a dedicated search by tag/title
    const filter = req.body.filter;
    try {
        let poks;
        if (filter) {
            poks = await Pok.find({
                "$or": [ 
                    { "title": { "$regex": filter, "$options": 'i' } }, 
                    { "content.data": { "$regex": filter, "$options": 'i' } },
                    { "tags": { "$regex": filter, "$options": 'i' }}
                ]
            });
        }
        else {
            poks = await Pok.find({});
        }
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
    const { title, isPrivate, content, isDraft, tags } = req.body;
    try {
        const pok = await Pok.findById(pokId);
        if (title) pok.title = title;
        if (isPrivate) pok.isPrivate = isPrivate;
        if (content) pok.content = content;
        if (isDraft) pok.isDraft = isDraft;
        if (tags) pok.tags = tags;
        await pok.save();
        res.status(200).json({pok});
    } catch (err) {
        errorHandler(err, next);
    }
}

exports.addChildPok = async (req, res, next) => {
    const childPokId = req.params.childPokId;
    const pokId = req.params.pokId;

    try {
        const pok = await Pok.findById(pokId);

        if (!pok) {
            const error = new Error('Pok does not exist!');
            error.statusCode = 500;
            throw error;
        }

        // make sure child does not exist already within pok
        pok.childrenPok.forEach(childPok => {
            if (childPok.toString() === childPokId) {
                const error = new Error('Child exists already!');
                error.statusCode = 500;
                throw error;
            }
        })

        // make sure target child pok is not already parent pok of current pok
        if (pok.parentPok && pok.parentPok.toString() === childPokId) {
            const parentPok = await Pok.findById(pok.parentPok);
            if (!parentPok) {
                const error = new Error('Parent pok does not exist!');
                error.statusCode = 500;
                throw error;
            }

            parentPok.childrenPok.filter(childPok => {
                return childPok.toString() !== pok._id.toString()
            })

            pok.parentPok = undefined;
            await parentPok.save();
        }

        pok.childrenPok.push(childPokId);

        const childPok = await Pok.findById(childPokId);

        if (!childPok) {
            const error = new Error('Child pok does not exist!');
            error.statusCode = 500;
            throw error;
        }

        childPok.parentPok = pok;

        await childPok.save();
        await pok.save();
        res.status(200).json({pok});
    } catch (err) {
        errorHandler(err, next);
    }
}

exports.addParentPok = async (req, res, next) => {
    const parentPokId = req.params.parentPokId;
    const pokId = req.params.pokId;

    try {
        const pok = await Pok.findById(pokId);

        if (!pok) {
            const error = new Error('Pok does not exist!');
            error.statusCode = 500;
            throw error;
        }


    } catch (err) {
        errorHandler(err, next);
    }
}