const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/db');

db();
const PORT = process.env.PORT;

app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));