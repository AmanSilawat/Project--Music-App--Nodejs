const express = require('express');
const Utils = require('./server-utils/utils.js');

const app = express();

// set the view engine to ejs and public folder
app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/', function setRootDir(req, res) {
    res.render('index');
});

app.get('/getData', function getDa(req, res) {
    Utils.getDirData(res).then((response) => res.send(response.children));
});

app.get('*', function unknowRequest(req, res) {
    let url = req.url
    if (url.match(/\./g) == null) {
        const musicDir = Utils.getDirData(res).then((response) => res.send(response.children));
        Utils.getUnknow(musicDir, req.url)
    } else {
        res.status(404).send('what???');
    }
});

app.listen(8080);
