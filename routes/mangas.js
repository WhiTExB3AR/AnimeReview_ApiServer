const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs') //file system để không lưu file cover vào thư mục upload nếu như lần create đó gặp error
const Manga = require('../models/manga')
const uploadPath = path.join('public', Manga.coverImageBasePath) //tạo thư mục upload ngay trong public
const imageMineTypes = ['image/jpeg', 'image/png', 'image/gif'] //array list support type of files images
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMineTypes.includes(file.mimetype)) //null, _ là kiểu dữ liệu boolean cho true là accept và false là ko accept
    }
})

//Route dùng để load toàn bộ manga trong database
router.get('/', async (req, res) => {
    let query = Manga.find()
    if(req.query.Title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    try {
        const mangas = await query.exec()
        res.render('mangas/index', {
            mangas: mangas,
            searchOptions: req.query
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


//Route dùng để load 1 manga cụ thể trong databse
router.get('/new', async (req, res) => {
    renderNewPage(res, new Manga())
})

//Route dùng để tạo mới manga trong database
router.post('/', upload.single('cover'), async (req, res) => { //upload.single('cover') là từng cover được upload lên sẽ được đặt tên file trong đúng thư mục uploads/mangaCovers
    const fileName = req.file != null ? req.file.filename : null //tạo ra một biến check file name của cover có null hay không
    const manga = new Manga({
        title: req.body.title,
        author: req.body.author,
        // createAt: new Date(req.body.creatAt),
        chapter: req.body.chapter,
        coverImageName: fileName, //fileName, _ để check nếu ko chọn cover để up thì sẽ bằng null và báo error
        description: req.body.description
    })
    
    try{
        const newManga = await manga.save()
        // res.redirect(`mangas/${newManga.id}`)
        res.redirect(`mangas`)
    }catch (error) {
        console.log(error)
        if(manga.coverImageName != null){
            removeMangaCover(manga.coverImageName) //nếu như ko có tên file image từ coverImageName thì sẽ ko thể remove đc
        }
        renderNewPage(res, manga, true)
    }
})

function removeMangaCover (fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err)
    }) //ko lưu link cover đó vào uploads/mangaCovers
}

function renderNewPage(res, manga, hasError = false){
    try{
        const params = {
            manga: manga
        }
        if (hasError) params.errorMessage = 'Error Creating Manga'
        res.render('mangas/new', params)
    } catch (error) {
        console.log(error)
        res.redirect('/mangas')
    }
}

module.exports = router