const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/db');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const adminRouter = require('./routes/adminRoute');
const librarianRouter = require('./routes/librarianRoute');

db();
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

app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));