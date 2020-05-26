const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//Route dùng để load toàn bộ tác giả trong database
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') //RegExp là để tìm không cần full tên tác giả, flag 'i' là không phân biệt hoa, thường
    }
    try {
        const authors = await Author.find(searchOptions); //trong {} là điều kiện để get từng author nhưng hiện tại chưa cần nên chừa trống để get all authors
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})
// router.get('/',(req, res) =>{ //Dùng async để bắt lỗi và cho code nhìn đẹp hơn
//     res.render('authors/index')
// })

//Route dùng để load 1 tác giả cụ thể trong databse
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
})

//Route dùng để tạo mới tác giả trong database
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save();
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`);
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating Author',
    })
  }
})
//router.post('/', (req, res) =>{  //Bắt lỗi theo code bên dưới sẽ hơi cồng kềnh, dùng JavaScript Async Await
//    const author = new Author ({
//        name: req.body.name
//    })
// author.save((err, newAuthor)=>{
//     if (err) {
//         res.render('authors/new', {
//             author: author,
//             errorMessage: 'Error creating Author'
//         })
//     } else {
//         // res.redirect(`authors/${newAuthor.id}`)
//         res.redirect(`authors`)
//     }
// })
//})

module.exports = router