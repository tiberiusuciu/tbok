const Pok = require('../models/pok');

const pokUtils = require('../utils/pok'); 

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
        pokUtils.errorHandler(err, next);
    }
}

exports.getPok = async (req, res, next) => {
    const pokId = req.params.pokId;
    try {
        const pok = await pokUtils.getPokUtil(pokId);
        res.status(200).json({pok});
    } catch (err) {
        pokUtils.errorHandler(err, next);
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
        pokUtils.errorHandler(err, next);
    }
}

exports.deletePok = async (req, res, next) => {
    const pokId = req.params.pokId;
    // remove parents and children
    try {
        await Pok.deleteOne({ _id: pokId })
        res.status(200).json({});
    } catch (err) {
        pokUtils.errorHandler(err, next);
    }
}

exports.putPok = async (req, res, next) => {
    const pokId = req.params.pokId;
    const { title, isPrivate, content, isDraft, tags } = req.body;
    try {
        const pok = await pokUtils.getPokUtil(pokId);

        if (title) pok.title = title;
        if (isPrivate) pok.isPrivate = isPrivate;
        if (content) pok.content = content;
        if (isDraft) pok.isDraft = isDraft;
        if (tags) pok.tags = tags;
        await pok.save();
        res.status(200).json({pok});
    } catch (err) {
        pokUtils.errorHandler(err, next);
    }
}

exports.addChildPok = async (req, res, next) => {
    const childPokId = req.params.childPokId;
    const pokId = req.params.pokId;

    try {
        const pok = await pokUtils.getPokUtil(pokId);

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
            const parentPok = await pokUtils.getPokUtil(pok.parentPok);

            parentPok.childrenPok.filter(childPok => {
                return childPok.toString() !== pok._id.toString()
            })

            pok.parentPok = undefined;
            await parentPok.save();
        }

        pok.childrenPok.push(childPokId);

        const childPok = await pokUtils.getPokUtil(childPokId);

        childPok.parentPok = pok;

        await childPok.save();
        await pok.save();
        res.status(200).json({pok});
    } catch (err) {
        pokUtils.errorHandler(err, next);
    }
}

exports.addParentPok = async (req, res, next) => {
    const parentPokId = req.params.parentPokId;
    const pokId = req.params.pokId;

    try {
        const pok = await pokUtils.getPokUtil(pokId);

        // remove it from the children
        // pok.childrenPok.forEach(childPokId => {
        //     if (childPokId.toString() === parentPokId) {
        //         const childPok = pokUtils.getPokUtil(childPokId);
        //         childPok.parentPok
        //     }
        // })


    } catch (err) {
        pokUtils.errorHandler(err, next);
    }
}