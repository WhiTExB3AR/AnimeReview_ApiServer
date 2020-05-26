const express = require('express')
const router = express.Router()
const Manga = require('../models/manga')

//Route dùng để load toàn bộ manga trong database
router.get('/', async (req, res) => {

})


//Route dùng để load 1 manga cụ thể trong databse
router.get('/new', (req, res) => {

})

//Route dùng để tạo mới manga trong database
router.post('/', async (req, res) => {

})
module.exports = router