const Utils = require('./server-utils/utils.js');
const express = require("express");
const app = express();
const server = require("http").Server(app);
const fs = require('fs');
const ss = require('socket.io-stream');

const io = require("socket.io")(server);

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function setRootDir(req, res) {
    res.render('index');
});

app.get('/getData', function getDa(req, res) {
    Utils.getDirData(res).then((response) => res.send(response.children));
});

io.on('connection', function (socket) {
    socket.on('client-stream-request', function (data) {
        var stream = ss.createStream();
        var filename = "./public/assets/data/singer/owais-raza-qadri/nabi-ka-jashn-aya.mp3";
        ss(socket).emit('audio-stream', stream, { name: filename });
        fs.createReadStream(filename).pipe(stream);
    });
});


server.listen(process.env.PORT || 8080);