const express = require('express')
const router = express.Router()
const Manga = require('../models/manga')

router.get('/',(req, res) =>{
    res.render('index') //file layout.ejs trong layouts
})

module.exports = router