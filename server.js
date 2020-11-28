const express = require('express');
const path = require('path');
const Jimp = require("jimp");
const { AUTO } = require('jimp');
const inputFolder = './public/images/';
const processedFolder = './public/compressed-images/';
let bodyParser = require('body-parser')
const fs = require('fs');
const fakeData = require('./javascript/barber-data');

const PORT = 8080;
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.listen(PORT);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/public/index.html'))
})

app.get('/schedule', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/public/schedule.html'))
})

app.get('/test', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/public/test.html'))
})

app.get('/checkout', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/public/checkout.html'))
})

app.get('/success', async (req, res) => {
  try {
    const stripe = require('stripe')('sk_test_51HBLUsDGxKT2NkYgUU4esEBYQdoRjrjcu6Lx0jQCcP3QFYAcDsz0lF7bypIFxDPVoW2NGffiYbNR9NbTeIMHYHWT00dXSKyY8k');

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

    console.log(customer)

    /*

    Now we need to find the customer in pending appointments by session_id, then grab that info, and create a new entry in the booked appointments db with the 
    payment method and customer id

    */

    res.sendFile(path.resolve(__dirname + '/public/success.html'))
  }
  catch(error) {
    console.log(error)
  }
})

// this will need to be changed to handle real data when that time comes
app.get('/api/barbers', async (req, res) => {
  res.json(fakeData);
})

app.get('/api/checkout', async (req, res) => {
  try 
  {
    const stripe = require('stripe')('sk_test_51HBLUsDGxKT2NkYgUU4esEBYQdoRjrjcu6Lx0jQCcP3QFYAcDsz0lF7bypIFxDPVoW2NGffiYbNR9NbTeIMHYHWT00dXSKyY8k');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'setup',
      success_url: 'http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:8080/success',
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
  console.log(data);

  res.status(200).send();
  // mark the time slots pending so they can't be taken 
})

app.post('/api/scheduledappointment', async(req, res) => {
  // move from pending to scheduled
})

app.post('/api/failedappointment', async(req, res) => {
  // clear the pending mark on those times
})