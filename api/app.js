const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const pokRoutes = require('./routes/pok');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/pok', pokRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message,
        data
    });  
});

mongoose.connect('mongodb://127.0.0.1:27017/tbok', { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    app.listen(3000);
})