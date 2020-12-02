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
  let sessionId = req.query.session_id;
  console.log(sessionId);

  // remove the appointment from the pending collection in the database

  res.redirect('/');
})

app.get('/success', async (req, res) => {
  try {
    const stripe = require('stripe')('sk_test_51HsZ8ND4ypkbyKItVIuZGst4qJomJ4yb7P03zNOjv0gJm6XSlOvNIXTUYwy9xQ4KWFlwkfhTdzHiMMkoiYs56olv001o6kkat8');

    let sessionId = req.query.session_id;

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

    /*

    Now we need to find the customer in pending appointments by session_id, then grab that info, and create a new entry in the booked appointments db with the 
    payment method and customer id, then remove it from pending.

    If the appointment is not found in pending, then we need to show that the transaction failed instead of displaying the success page.

    */

    res.sendFile(path.resolve(__dirname + '/private/success.html'))
  }
  catch(error) {
    console.log(error)
  }
})

// this will need to be changed to handle real data when that time comes
app.get('/api/barbers', async (req, res) => {
  res.json(barberData);
})

app.get('/api/pendingappointments', (req, res) => {
  res.json(pendingData)
})

app.get('/api/scheduledappointments', (req, res) => {
  res.json(scheduledData)
})

app.get('/api/checkout', async (req, res) => {
  try 
  {
    const stripe = require('stripe')('sk_test_51HsZ8ND4ypkbyKItVIuZGst4qJomJ4yb7P03zNOjv0gJm6XSlOvNIXTUYwy9xQ4KWFlwkfhTdzHiMMkoiYs56olv001o6kkat8');

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

  res.status(200).send();
  // add the appointment to the pending collection in the database
})

app.post('/api/scheduledappointment', async(req, res) => {
  // move from pending to scheduled
})

app.post('/api/failedappointment', async(req, res) => {
  // clear the pending mark on those times
})
