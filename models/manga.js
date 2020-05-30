const mongoose = require('mongoose')
// const path = require('path')
// const coverImageBasePath = 'uploads/mangaCovers' //tất cả ảnh đc up lên từ formCreate của manga

//Mô tả cấu trúc 1 object (1 table trong database)
const mangaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
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
    // coverImageName: {
    //     type: Buffer,
    //     required: true
    // },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    }
    // createAt: {
    //     type: Date,
    //     required: true
    // }
})

// mangaSchema.virtual('coverImagePath').get(function(){
//     if (this.coverImageName != null){
//         return path.join('/', coverImageBasePath, this.coverImageName)
//     }
// })
mangaSchema.virtual('coverImagePath').get(function(){
    if (this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType}; charset=utf-8; base64, 
        ${this.coverImage.toString('base64')}`
    }
})


module.exports = mongoose.model('Manga', mangaSchema)
// module.exports.coverImageBasePath = coverImageBasePath