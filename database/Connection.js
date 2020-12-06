var MongoClient = require('mongodb').MongoClient;
const URI = process.env.DB_URI;

class Connection {
  constructor() {
    this.connection = null;
  }

  getData(collectionName) {
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
      return client.connect().then(() => {
        let collection = client.db("testing").collection(collectionName);

        return collection.find().toArray();
      }).then((items) => {
        client.close()

        return items;
      })
  }

  insertData(collectionName, data) {
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

    return client.connect().then(async () => {
      let collection = client.db("testing").collection(collectionName);

      // ensures the dates are stored as dates and not strings
      try {
        data.forEach(item => {
          item.creationDate = new Date(item.creationDate);
        });
      }
      catch (e) {
        console.log(e);
      }
      
      return collection.insertMany(data);
    }).then((result) => {
      client.close();

      if (result.insertedCount > 0) {
        return 200;
      } 
      else {
        return 500;
      }
    })
  }

  deleteData(collectionName, sessionId) {
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

    let data = [];

    return client.connect().then(() => {
      let collection = client.db("testing").collection(collectionName);

      let appointments = collection.find({"stripeId": sessionId});

      appointments.forEach(app => {
        data.push(app);
      });

      return collection.deleteMany({"stripeId": sessionId});
    }).then((result) => {
      if(result.deletedCount > 0) {
        return data;
      } 
      else {
        return 500;
      }
    })
  }
}

module.exports = Connection;