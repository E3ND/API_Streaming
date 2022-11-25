const mongoose = require('mongoose')
const { Schema } = mongoose

// Tabela Tags
const Tag = mongoose.model(
    'Tag',
    new Schema({
        name: {
            type: String,
            required: true
        },

        user: Object,
        video: Array,

    }, { timestamps: true })
)

module.exports = Tag