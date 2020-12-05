if(process.env.NODE_ENV !== 'Production'){
  require('dotenv').config()
}

const express = require('express');
const path = require('path');
let bodyParser = require('body-parser');
const barberData = require('./javascript/barber-data');
const pendingData = require('./javascript/pending-appointments-data');
const scheduledData = require('./javascript/scheduled-appointments-data');
const bcrypt = require('bcrypt');
const passport = require('passport');
const routes = require('./routes')(passport);
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config');
const { stringify } = require('querystring');
const { request } = require('http');
const Connection = require('./database/Connection');

const connection = new Connection();

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

app.get('/cancelled', async (req, res) => {
  const sessionId = req.query.session_id;

  await connection.deleteData('PendingAppointments', sessionId);

  res.redirect('/schedule');
})

app.get('api/charge', async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET);

    const sessionId = req.query.session_id;
  
    const session = await stripe.checkout.sessions.retrieve(sessionId);
  
    const key = session.setup_intent;
  
    const intent = await stripe.setupIntents.retrieve(key);
  
    const payment_method = intent.payment_method;
  
    const customer = await stripe.customers.create({
      payment_method: payment_method,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });
  
    const charge = await stripe.charges.create({
      amount: 15,
      currency: 'usd',
      customer: customer.id,
    });

    return 200;
  } 
  catch (error) {
    return 500;
  }
})

app.get('/success', async (req, res) => {
   let sessionId = req.query.session_id;

   deleteResult = await connection.deleteData('PendingAppointments', sessionId);
 
   if (deleteResult == 500) {
      res.sendFile(path.resolve(__dirname + '/private/failure.html'))
   }
 
   result = await connection.insertData('ScheduledAppointments', deleteResult);
 
   if (result != 200) {
    res.sendFile(path.resolve(__dirname + '/private/failure.html'))
   }

    res.sendFile(path.resolve(__dirname + '/private/success.html'))
})

app.get('/api/barbers', async (req, res) => {
  let barberData = await connection.getData('Barbers');
  res.json(barberData);
})

app.get('/api/pendingappointments', async (req, res) => {
  let pendingData = await connection.getData('PendingAppointments');
  res.json(pendingData)
})

app.get('/api/scheduledappointments', async (req, res) => {
  let scheduledData = await connection.getData('ScheduledAppointments');
  res.json(scheduledData)
})

app.get('/api/checkout', async (req, res) => {
  try 
  {
    const stripe = require('stripe')(process.env.STRIPE_SECRET);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'setup',
      success_url: 'http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:8080/cancelled?session_id={CHECKOUT_SESSION_ID}',
    });

    res.send(session)
  }
  catch(error)
  {
    console.log(error)
  }
})

app.post('/api/pendingappointment', async(req, res) => {
  let data = req.body;

  result = await connection.insertData('PendingAppointments', data);

  res.status(result).send();
})
