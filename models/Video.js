const mongoose = require('mongoose')
const { Schema } = mongoose

// Tabela video
const Video = mongoose.model(
    'Video',
    new Schema({
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
        },

        video: {
            type: String,
            required: true
        },

        user: Object,
        tag: Object,

    }, { timestamps: true })
)

module.exports = Video