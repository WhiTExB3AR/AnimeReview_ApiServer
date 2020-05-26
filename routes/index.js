const express = require('express')
const router = express.Router()

router.get('/',(req, res) =>{
    res.render('index') //file layout.ejs trong layouts
})

module.exports = router