module.exports = function(passport){
    const express = require('express');
    const router = express.Router();
    const path = require('path');
    const connectDB = require('./DB/Connection');

    router.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/public/index.html'))
    })
    
    router.get('/schedule', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/private/schedule.html'))
    })

    router.get('/admin', checkAuthentication, (req, res) => {
        res.sendFile(path.resolve(__dirname + '/private/admin-barbers.html'));
        connectDB();
    })

    router.get('/admin-barbers', checkAuthentication, (req, res) => {
        res.sendFile(path.resolve(__dirname + '/private/admin-barbers.html'))
    })

    router.get('/admin-appointment', checkAuthentication, (req, res) => {
        res.sendFile(path.resolve(__dirname + '/private/admin-appointment.html'))
    })

    router.get('/login', checkAlreadyAuthenticated, (req, res) => {
        res.sendFile(path.resolve(__dirname + '/public/login.html'))
    })

    router.post('/login', checkAlreadyAuthenticated, passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/'
    }))
    
    router.delete('/logout', (req, res) => {
        req.logOut()
        res.redirect('/login')
    })
    
    router.get('/test', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/private/test.html'))
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