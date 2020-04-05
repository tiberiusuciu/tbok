const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pokSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: [
        {
            nodeType: {
                type: String,
                required: true
            },
            data: {
                type: String,
                required: true
            }
        }
    ],
    isPrivate: {
        type: Boolean,
        default: false
    },
    isDraft: Boolean,
    tags: [
        {
            type: String
        }
    ],
    parentPok: {
        type: Schema.Types.ObjectId,
        ref: 'Pok'
    },
    childrenPok: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Pok'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Pok', pokSchema);