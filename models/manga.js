const mongoose = require('mongoose')

//Mô tả cấu trúc 1 object (1 table trong database)
const mangaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    chapter: {
        type: Number,
        required: true
    },
    createAt: {
        type: Date,
        required:true,
        default: Date.now
    },
    coverImageName: {
        type: String,
    },
    author: {
        type: String,
        required
    }
})

module.exports = mongoose.model('Book', bookSchema)