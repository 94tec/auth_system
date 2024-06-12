const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

require('dotenv').config();
// Passport Config
require('./config/passport')(passport);

const main = async () => {
  const PORT = process.env.PORT || 5000;
  const mongoURI = process.env.mongoURI;

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('Connected to the Database');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};
main();

// Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/authRoutes'));
