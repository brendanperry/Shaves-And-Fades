module.exports = function(passport) {
    const express = require('express');
    const router = express.Router();
    const path = require('path');
    const Connection = require('./database/Connection');
    const stripeController = require('./controllers/stripe.controller');

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

    router.get('api/charge', stripeController.charge)

    router.get('/api/checkout', stripeController.checkout)
      
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