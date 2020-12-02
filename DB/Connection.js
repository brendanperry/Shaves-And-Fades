const mongoose = require('mongoose');
const URI = "mongodb+srv://ramii:Shaves101@cluster0.fyndo.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";
const connectDB = async()=>{
  await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('db connected!');
}

module.exports = connectDB;