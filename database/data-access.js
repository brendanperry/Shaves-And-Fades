var MongoClient = require('mongodb').MongoClient

module.exports = {
    GetData: function() {

        // I made a new mongodb local database by typing the command mongod
        // then in another terminal window, I used the command mongo to access the server
        // I then used the command db to see my current database which was 'test'
        // then I did db.users.insertOne({ name: 'Bryan' }) to make a new object user and insert bryan

        // MongoClient.connect('mongodb://localhost:27017/users', function (err, database) {
        // if (err) console.log(err)

        // const db = database.db('test')

        // db.collection('users').find().toArray(function (err, result) {
        //     if (err) console.log(err)

        //     console.log(result)
        // })
        // })

        console.log("yay data")
    }
}