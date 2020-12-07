require('dotenv').config()
const express = require('express');
let bodyParser = require('body-parser');
const passport = require('passport');
const routes = require('./routes')(passport);
const session = require('express-session');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const barbers = require('./javascript/barber-data');

initializePassport(
  passport, 
  userName => barbers.find(user => user.username === userName),
  id => barbers.find(user => user.id === id)
)

const PORT = 8080;
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: "secret",
  resave: false, 
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(bodyParser.json());

module.exports = {
  passport: passport,
  app: app,
}

app.use('/', routes);
app.listen(PORT);