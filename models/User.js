const mongoose = require('mongoose')
const { Schema } = mongoose

// Tablea usuário
const User = mongoose.model(
    'User',
    new Schema({
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },
        
        password: {
            type: String,
            required: true
        },

        image: {
            type: String,
        },
    }, { timestamps: true })
)

module.exports = User