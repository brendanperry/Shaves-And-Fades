const express = require('express');
const path = require('path');
const Jimp = require("jimp");
const { AUTO } = require('jimp');
const inputFolder = './public/images/';
const processedFolder = './public/compressed-images/';
const fs = require('fs');
const fakeData = require('./javascript/fake-data');

const PORT = 8080;
const app = express();

app.use(express.static(__dirname + '/public'));
app.listen(PORT);

// By default, all .png and .jpg images will be scaled to 1920xY and compressed to 70%.
// If you want an image to be skipped, make the file extension in all caps (.PNG instead of .png)
// Images smaller than 1080p may want to be skipped (the logo)
// This is being temporarily removed due to performance issues

// fs.readdir(inputFolder, (err, files) => {
//   files.forEach(file => {
//     if (file.endsWith(".jpg") || file.endsWith(".png")) {
//       resizeImage(file);
//     }
//   });
// });

// function resizeImage(fileName) {
//   Jimp.read(inputFolder + fileName).then(function (image) {
//     if(image.scale)
//     image
//         .resize(1920, Jimp.AUTO)
//         .quality(70)
//         .write(processedFolder + fileName);
//   })

//   console.log("Image compressed: " + processedFolder + fileName)
// }

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/public/index.html'))
})

app.get('/schedule', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/public/schedule.html'))
})

app.get('/test', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/public/test.html'))
})

// this will need to be changed to handle real data when that time comes
app.get('/api/barbers', (req, res) => {
  res.json(fakeData);
})