const express = require('express');
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');
const protect = require('./middleware/auth');

//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(passport.initialize());

require('./config/passport');


app.use('/articles', protect, articleRoutes);
app.use('/users', userRoutes);

module.exports = app;

