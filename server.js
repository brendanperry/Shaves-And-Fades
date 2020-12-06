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
const Connection = require('./database/Connection');
const Api = require('./javascript/api');

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

    let api = new Api();
    let domain = api.getDomain();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'setup',
      success_url: domain + 'success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: domain + 'cancelled?session_id={CHECKOUT_SESSION_ID}',
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
