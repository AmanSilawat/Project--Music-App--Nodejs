const express = require("express");
const app = express();
const server = require("http").createServer();
const Utils = require('./server-utils/utils.js');
const fs = require('fs');
const io = require("socket.io")(server);

app.use(express.json());


// set the view engine to ejs and public folder
app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/', function setRootDir(req, res) {
    res.render('index');
});

app.get('*', function unknowRequest(req, res) {
    const { url } = req;
    if (url.match(/\./g) == null) {
        const musicDir = Utils.getDirData(res).then((response) =>
            res.send(response.children)
        );
        Utils.getUnknow(musicDir, req.url);
    } else {
        res.status(404).send('what???');
    }
});

app.listen(8080);
