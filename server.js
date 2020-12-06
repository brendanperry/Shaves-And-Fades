if(process.env.NODE_ENV !== 'Production'){
  require('dotenv').config()
}

const express = require('express');
let bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const routes = require('./routes')(passport);
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');

initializePassport(
  passport, 
  userName => testUser.find(user => user.name === userName),
  id => testUser.find(user => user.id === id)
)

//THIS IS FOR TESTING ONLY, LIVE WILL USE DATABASE USERS
const testUser = []
const adminPassword = "password";
const saltRounds = 10;

bcrypt.genSalt(saltRounds, function (err, salt){
  if(err){
    throw err
    }
    else{
      bcrypt.hash(adminPassword, salt, function(err, hash){
        if(err){
          throw err
        }
    else{
        testUser.push({
          id: Date.now().toString(),
          name: "Admin",
          password: hash
          })
        }
      })
    }
})

const PORT = 8080;
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, 
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(bodyParser.json());

module.exports = passport;
app.use('/', routes);
app.listen(PORT);