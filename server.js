const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/db');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const adminRouter = require('./routes/adminRoute');
const librarianRouter = require('./routes/librarianRoute');
const userRouter = require('./routes/userRoute');
const bookRouter = require('./routes/bookRoute');
const orderRouter = require('./routes/orderRoute');

const PORT = process.env.PORT  || 8000;
// JSON PARSER MIDDLEWARE
app.use(express.json());
// ENCODED URL PARSER MIDDLEWARE
app.use(express.urlencoded({extended: true}));
// COOKIE MIDDLEWARE
app.use(cookieParser());
// MORGAN MIDDLEWARE
app.use(morgan('dev'));
// ROUTES MIDDLEWARES
app.use('/api/admin', adminRouter);
app.use('/api/librarian', librarianRouter);
app.use('/api/user', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/orders', orderRouter);

db().then((result)=> app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`)))
.catch((err)=> console.log(err))