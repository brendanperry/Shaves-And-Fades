module.exports = function(passport) {
    const express = require('express');
    const router = express.Router();
    const path = require('path');
    const Connection = require('./database/Connection');
    const Api = require('./javascript/api');

    const connection = new Connection();

    router.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/public/index.html'))
    })
    
    router.get('/schedule', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/private/schedule.html'))
    })

    router.get('/admin', checkAuthentication, (req, res) => {
        res.sendFile(path.resolve(__dirname + '/private/admin-dash.html'));
    })

    router.get('/admin-barbers', checkAuthentication, (req, res) => {
        res.sendFile(path.resolve(__dirname + '/private/admin-dash.html'))
    })

    router.get('/admin-appointment', checkAuthentication, (req, res) => {
        res.sendFile(path.resolve(__dirname + '/private/admin-dash.html'))
    })

    router.get('/login', checkAlreadyAuthenticated, (req, res) => {
        res.sendFile(path.resolve(__dirname + '/public/login.html'))
    })

    router.get('/api/cancelled', async (req, res) => {
        const sessionId = req.query.session_id;
        
        await connection.deleteData('PendingAppointments', sessionId);
        
        res.redirect('/schedule');
    })

    router.get('/api/success', async (req, res) => {
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

    router.post('/login', checkAlreadyAuthenticated, passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/'
    }))
    
    router.delete('/logout', (req, res) => {
        req.logOut()
        res.redirect('/login')
    })
    
    router.get('/admin-dash', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/private/admin-dash.html'))
    })

    router.get('api/charge', async (req, res) => {
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
      
    router.get('/api/barbers', async (req, res) => {
        let barberData = await connection.getData('Barbers');
        res.json(barberData);
    })
    
    router.get('/api/pendingappointments', async (req, res) => {
        let pendingData = await connection.getData('PendingAppointments');
        res.json(pendingData)
    })
    
    router.get('/api/scheduledappointments', async (req, res) => {
        let scheduledData = await connection.getData('ScheduledAppointments');
        res.json(scheduledData)
    })
    
    router.get('/api/checkout', async (req, res) => {
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
    
    router.post('/api/pendingappointment', async(req, res) => {
        let data = req.body;
        
        result = await connection.insertData('PendingAppointments', data);
        
        res.status(result).send();
    })      
    
    function checkAuthentication(req, res, next){
        if (req.isAuthenticated()){
            return next()
        }
        res.redirect('/login')
    }
    
    function checkAlreadyAuthenticated(req, res, next){
        if (req.isAuthenticated()){
            return res.redirect('/admin')
        }
        next()
    }

    return router;
}