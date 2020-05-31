const express = require('express')
const router = express.Router()
//const multer = require('multer') //không cần nữa vì đã có filePond
// const path = require('path')
// const fs = require('fs') //file system để không lưu file cover vào thư mục upload nếu như lần create đó gặp error
const Manga = require('../models/manga')
// const uploadPath = path.join('public', Manga.coverImageBasePath) //tạo thư mục upload ngay trong public
const imageMineTypes = ['image/jpeg', 'image/png', 'image/gif'] //array list support type of files images
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMineTypes.includes(file.mimetype)) //null, _ là kiểu dữ liệu boolean cho true là accept và false là ko accept
//     }
// })

//Route dùng để load toàn bộ manga trong database
router.get('/', async (req, res) => {
    let query = Manga.find()
    if(req.query.title != null && req.query.title != '') {
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
//router.post('/', upload.single('cover'), async (req, res) => { //upload.single('cover') là từng cover được upload lên sẽ được đặt tên file trong đúng thư mục uploads/mangaCovers
router.post('/', async (req, res) => { //upload.single('cover') là từng cover được upload lên sẽ được đặt tên file trong đúng thư mục uploads/mangaCovers
    // const fileName = req.file != null ? req.file.filename : null //tạo ra một biến check file name của cover có null hay không
    const manga = new Manga({
        title: req.body.title,
        author: req.body.author,
        // createAt: new Date(req.body.creatAt),
        chapter: req.body.chapter,
        // coverImageName: fileName, //fileName, _ để check nếu ko chọn cover để up thì sẽ bằng null và báo error
        description: req.body.description
    })
    saveCover(manga, req.body.cover)

    try{
        const newManga = await manga.save()
        res.redirect(`mangas/${newManga.id}`)
        // res.redirect(`mangas`)
    }catch (error) {
        console.log(error)
        // if(manga.coverImageName != null){
        //     removeMangaCover(manga.coverImageName) //nếu như ko có tên file image từ coverImageName thì sẽ ko thể remove đc
        // }
        renderNewPage(res, manga, true)
    }
})

// function removeMangaCover (fileName){
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if(err) console.error(err)
//     }) //ko lưu link cover đó vào uploads/mangaCovers
// }

//Route dùng để xem thông tin 1 manga
router.get('/:id', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id)
        res.render('mangas/show', { manga: manga })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

//Route đi vào edit 1 manga
router.get('/:id/edit', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id)
        renderEditPage(res, manga)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

//Route để update thông tin của 1 manga
router.put('/:id', async (req, res) => { 
    let manga
    try{
        manga = await Manga.findById(req.params.id)
        manga.title = req.body.title,
        manga.author = req.body.author,
        manga.chapter = req.body.chapter,
        manga.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(manga, req.body.cover)
        }
        await manga.save()
        res.redirect(`/mangas/${manga.id}`)
    }catch (error) {
        console.log(error)
        if (manga != null) {
            renderEditPage(res, manga, true)
        } else {
            redirect('/')
        }
    }
})

//Route để delete 1 manga
router.delete('/:id', async (req, res) => {
    let manga
    try {
        manga = await Manga.findById(req.params.id)
        await manga.remove()
        res.redirect('/mangas')
    } catch (error) {
        console.log(error)
        if (manga != null) {
            res.render('mangas/show', {
                manga: manga,
                errorMessage: 'Could not remove manga'
            })
        } else {
            res.redirect('/')
        }
    }
})

function renderNewPage(res, manga, hasError = false){
    // try{
    //     const params = {
    //         manga: manga
    //     }
    //     if (hasError) params.errorMessage = 'Error Creating Manga'
    //     res.render('mangas/new', params)
    // } catch (error) {
    //     console.log(error)
    //     res.redirect('/mangas')
    // }
    renderFormPage(res, manga, 'new', hasError)
}

function renderEditPage(res, manga, hasError = false){
    // try{
    //     const params = {
    //         manga: manga
    //     }
    //     if (hasError) params.errorMessage = 'Error Creating Manga'
    //     res.render('mangas/edit', params)
    // } catch (error) {
    //     console.log(error)
    //     res.redirect('/mangas')
    // }
    renderFormPage(res, manga, 'edit', hasError)
}

//Tạo ra một cái function để gọi 2 hàm trên là renderNewPage và renderEditPage
function renderFormPage(res, manga, form, hasError = false){
    try{
        const params = {
            manga: manga
        }
        if (hasError) {
            if (form == 'edit') {
                params.errorMessage = 'Error Updating Manga'
            } else {
                params.errorMessage = 'Error Creating Manga'
            }
        }
        res.render(`mangas/${form}`, params)
    } catch (error) {
        console.log(error)
        res.redirect('/mangas')
    }
}

function saveCover(manga, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMineTypes.includes(cover.type)){
        manga.coverImage = new Buffer.from(cover.data, 'base64')
        manga.coverImageType = cover.type
    }
}

module.exports = router