const express = require('express');

const app = express();

const path = require('path');
const fs = require('fs');

// __dirname, process.cwd() ::: get app directory
const musicDir = path.join(__dirname, '/public/assets/data/top5');

fs.readdir(musicDir, (err, files) => {
    files.forEach(file => {
        console.log(file);

    });

    console.log(err);
});

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function setRootDir(req, res) {
    res.render('index');
});

app.listen(8080);


// Blue Print 1
const data = {
    album: {
        aarzooERehmat: ['completePath1', 'completePath2'],
        alNabi: ['completePath1', 'completePath2'],
    },
    mod: {
        naatSarif: ['fileName1', 'fileName2'],
        qawwalies: {
            bestQawwalies: ['fileName1', 'fileName2'],
            sufiQawwalies: ['fileName1', 'fileName2'],
        },
    },
    singer: {
        atif: ['completePath1', 'completePath2'],
        hafizAhamedRazaQadri: ['completePath1', 'completePath2'],
        owieshRazaQadri: ['completePath1', 'completePath2'],
    },
    top10: ['fileName1', 'fileName2'],
};

// Blue Print 2
const dataHomePage = {
    album: ['aarzooERehmat', 'alNabi'],
    mod: ['naatSarif', 'qawwalies'],
    singer: ['atif', 'hafizAhamedRazaQadri', 'owieshRazaQadri'],
    top10: ['fileName1', 'fileName2'],
};