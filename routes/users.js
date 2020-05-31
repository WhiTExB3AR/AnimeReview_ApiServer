const express = require('express')
const router = express.Router()
const User = require('../models/user')

//Route dùng để load toàn bộ người dùng trong database
// router.get('/',(req, res) =>{ //Dùng async để bắt lỗi và cho code nhìn đẹp hơn
//     res.render('Users/index')
// })
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

//Route dùng để load 1 người dùng cụ thể trong databse
router.get('/new', (req, res) => {
  res.render('users/new', {
    user: new User()
  });
})

//Route dùng để tạo mới người dùng trong database
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
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.pwd
  })
  try {
    const newUser = await user.save()
    res.redirect(`users/${newUser.id}`)
  } catch (error) {
    console.log(error)
    res.render('users/new', {
      user: user,
      errorMessage: 'Error creating User',
    })
  }
})

//Route dùng để xem thông tin 1 user
router.get('/:id', async (req, res) => { //lấy id user từ trang gốc
  // res.send('Show User '+ req.params.id)
  try {
    const user = await User.findById(req.params.id)
    res.render('users/show', { user: user })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

//Route đi vào edit 1 user
router.get('/:id/edit', async (req, res) => {
  // res.send('Edit User ' + req.params.id)
  try {
    const user = await User.findById(req.params.id)
    res.render('users/edit', { user: user })
  } catch  {
    res.redirect('/users')
  }

})

//Route để update thông tin của 1 user
router.put('/:id', async (req, res) => { //không thêm /edit vào vì giao thức PUT đã mặc định là update/edit rồi
  // res.send('Update User ' + req.params.id)
  let user
  try {
    user = await User.findById(req.params.id)
    //thêm vào các trường để update 
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.pwd
    await user.save()
    res.redirect(`/users/${user.id}`)
  } catch (error) {
    console.log(error)
    if (user == null) {
      res.redirect('/')
    } else {
      res.render('users/edit', {
        user: user,
        errorMessage: 'Error updating User',
      })
    }
  }
})

//Route để delete 1 user
router.delete('/:id', async (req, res) => { //không thêm /delete vào vì giao thức DELETE đã mặc định là delete rồi
  // res.send('Delete User ' + req.params.id)
  let user
  try {
    user = await User.findById(req.params.id)
    await user.remove()
    res.redirect('/users')
  } catch (error) {
    console.log(error)
    if (user == null) {
      res.redirect('/')
    } else {
      res.redirect(`/users/${user.id}`)
    }
  }
})

module.exports = router