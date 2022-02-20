import express from 'express';
import { config } from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import bodyParser from 'body-parser'

import { connectDB } from './config/db.js';

import {router} from './routes/transactions.js'

config({path:'./config/config.env'});

connectDB();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json());

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1', router);


const PORT = process.env.PORT || 5000;

// app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))
app.listen(PORT)
