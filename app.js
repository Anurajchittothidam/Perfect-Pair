const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser=require('body-parser')
const session = require('express-session');
const mongoose =require('mongoose');
const usersRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
require('dotenv').config()

MONGODB_URI=process.env.MONGODB_URI;
const app = express();

const PORT=process.env.PORT;

app.listen(PORT,()=>{
  console.log('app is running on port 3000');
})

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI).then(()=>{
    console.log('mongodb connected');
}).catch((err)=>{
    console.log('Failed to connect');
    console.log(err)
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(expressLayouts)
// app.set('layout',"./layout/layout")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser())
app.use(session({
    secret: "thisismysecretkey",
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
    resave: false,
}))

//to prevent storing cache
app.use((req, res, next) => {
  res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"     
  );
  next();
})

app.use('/', usersRouter);
app.use('/admin', adminRouter);


app.use((req, res) => {
  res.status(404).render('users/error');
});
