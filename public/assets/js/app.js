import Utils from '../services/utils.js';
import MusicApp from './MusicApp.js';
import MusicAppView from './MusicAppView.js';
import Base64Binary from './Base64Binary.js';

// let mainEle = document.getElementById('container');

// document.addEventListener('DOMContentLoaded', async function musicDirData(params) {
//     const reqMusicDir = await fetch('./getData');
//     const musicAppViewInstance = new MusicAppView(await reqMusicDir.json(), 'home_page');
//     const musicApp = new MusicApp(musicAppViewInstance, MusicAppView);
// });


// let socket = io('/');
let socket = io.connect('http://localhost:8080/');
// socket.emit('message', 'Aman Khan Silawat');

let audioContext = new AudioContext();
let startTime = 0;

socket.on('message', function(data) {
    audioContext.decodeAudioData(data.buffer, function(buffer) {
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);

        source.start(startTime);
        startTime += buffer.duration;
        console.log(source, audioContext);
    });
});




// var audioContext = new (window.AudioContext || window.webkitAudioContext)();
// let startTime = 0;
// var flag = true;
// let i = 1;

// let chunks = [];

// socket.on('message', (data) => {
//     audioContext.decodeAudioData(data.buffer, function (buffer) {
//         // if (i == 1) {
//             playSound(buffer); // don't start processing it before the response is there!
//         // }
//         //  else {
//         //     chunks.push(buffer);
//         // }
//         i++;
//     }, function (error) {
//         console.error("decodeAudioData error", error);
//     });
// });


// var source = audioContext.createBufferSource();
// source.onended = () => {
//     console.log(chunks.shift());

//     source.buffer = undefined;
//     playSound(chunks.shift())
// };

// function playSound(buffer) {
    
//     var source = audioContext.createBufferSource();
//     source.buffer = buffer;
//     source.connect(audioContext.destination);
    
//     source.start(startTime);
//     startTime += buffer.duration;
//     console.log(startTime);
// }
