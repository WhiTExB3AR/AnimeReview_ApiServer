//Thông báo cho ứng dụng biết là phải load dữ liệu trong database ở mongo
//Check ứng dựng có bắt được database trong .env hay không
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')
const mangaRouter = require('./routes/mangas')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout') 
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false})) //

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true, useUnifiedTopology: true}) //Không code cứng đường dẫn cho Api vì app sẽ chạy trên server không chạy trên locallhost
const database = mongoose.connection
database.on('error', error => console.error(error)) //Bắt lỗi
database.once('open',() => console.log('Connected to Database')) //Kết nối một lần đầu, thành công thì báo

app.use('/', indexRouter)
app.use('/users', userRouter) //tất cả các route có đi qua /users sẽ dùng userRouter
app.use('/mangas', mangaRouter) //tất cả các route có đi qua /users sẽ dùng userRouter

app.listen(process.env.PORT || 3000, () =>{
    console.log('Server is running')
})

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });
  
// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });
  