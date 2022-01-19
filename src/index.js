const express = require('express');
const morgan = require('morgan');
const path = require('path');

// Initializations
const app = express();

// Settings
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require('./routes/index.route'));
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/404.html'));
});

// SERVER LISTEN
app.listen(PORT, (req, res) => {
    console.log(`Server run on port: ${PORT}`);
});