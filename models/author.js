const mongoose = require('mongoose')

//Mô tả cấu trúc 1 object (1 table trong database)
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Author', authorSchema)