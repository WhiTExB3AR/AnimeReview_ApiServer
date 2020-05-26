const express = require('express')
const router = express.Router()
const User = require('../models/user')

//Route dùng để load toàn bộ người dùng trong database
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i') //RegExp là để tìm không cần full tên tác giả, flag 'i' là không phân biệt hoa, thường
  }
  try {
    const users = await User.find(searchOptions); //trong {} là điều kiện để get từng người dùng nhưng hiện tại chưa cần nên chừa trống để get all users
    res.render('users/index', {
      users: users,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})
// router.get('/',(req, res) =>{ //Dùng async để bắt lỗi và cho code nhìn đẹp hơn
//     res.render('Users/index')
// })

//Route dùng để load 1 người dùng cụ thể trong databse
router.get('/new', (req, res) => {
  res.render('users/new', {
    user: new User()
  });
})

//Route dùng để tạo mới người dùng trong database
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.pwd
  })
  try {
    const newUser = await user.save();
    // res.redirect(`users/${newUser.id}`)
    res.redirect(`users`);
  } catch (error) {
    console.log(error)
    res.render('users/new', {
      user: user,
      errorMessage: 'Error creating User',
    })
  }
})
//router.post('/', (req, res) =>{  //Bắt lỗi theo code bên dưới sẽ hơi cồng kềnh, dùng JavaScript Async Await
//    const user = new User ({
//            name: req.body.name,
//            email: req.body.email,
//            pwd: req.body.pwd
//    })
// user.save((err, newUser)=>{
//     if (err) {
//         res.render('users/new', {
//             user: user,
//             errorMessage: 'Error creating User'
//         })
//     } else {
//         // res.redirect(`users/${newUser.id}`)
//         res.redirect(`users`)
//     }
// })
//})

module.exports = router