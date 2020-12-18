import Utils from '../services/utils.js';
import MusicApp from './MusicApp.js';
import MusicAppView from './MusicAppView.js';
import Base64Binary from './Base64Binary.js';

let mainEle = document.getElementById('container');

document.addEventListener('DOMContentLoaded', async function musicDirData(params) {
    const reqMusicDir = await fetch('./getData');
    const musicAppViewInstance = new MusicAppView(await reqMusicDir.json(), 'home_page');
    const musicApp = new MusicApp(musicAppViewInstance, MusicAppView);
});



// ! demo show all buffer data
// let socket = io.connect('http://localhost:8080/');
// var audioContext = new (window.AudioContext || window.webkitAudioContext)();
// socket.emit('client-stream-request', 'Aman Khan Silawat');
// let parts = [];

// ss(socket).on('audio-stream', function (stream, data) {
//     stream.on('data', function (chunk) {
//         parts.push(chunk)
//     });
//     stream.on('end', function () {
//         console.log(parts);
//     });
// });






// ! play chunks after first chunk is ended
// let socket = io.connect('http://localhost:8080/');
// var audioContext = new (window.AudioContext || window.webkitAudioContext)();
// // socket.emit('client-stream-request', 'Aman Khan Silawat');
// let parts = [];
// let startTime = 0;

// ss(socket).on('audio-stream', function (stream, data) {
//     stream.on('data', function (chunk) {
//         parts.push(chunk.buffer)
//     });
//     stream.on('end', function () {
//         console.log('end');
//         console.log(parts);
//         audioContext.decodeAudioData(parts.shift(), function (buffer) {
//             var source = audioContext.createBufferSource();
//             source.buffer = buffer;
//             source.connect(audioContext.destination);
//             source.start(0);
//             source.addEventListener('ended', musicEnded);
//         });
//     });
// });

// function musicEnded() {
//     audioContext.decodeAudioData(parts.shift(), function (buffer) {
//         console.log('again ened');
//         var source = audioContext.createBufferSource();
//         source.buffer = buffer;
//         source.connect(audioContext.destination);
//         source.start(0);
//         source.addEventListener('ended', musicEnded);
//     });
// }







// ! chunks play with stream data in one time
// let socket = io.connect('http://localhost:8080/');
// var audioContext = new (window.AudioContext || window.webkitAudioContext)();
// // socket.emit('client-stream-request', 'Aman Khan Silawat');
// let parts = [];
// let nextTime = 0;

// ss(socket).on('audio-stream', function (stream, data) {
//     stream.on('data', function (chunk) {
//         audioContext.decodeAudioData(chunk.buffer, function (buffer) {
//             var source = audioContext.createBufferSource();
//             source.buffer = buffer;
//             source.connect(audioContext.destination);
//             if (nextTime == 0) {
//                 nextTime = audioContext.currentTime + 0.1;  /// add 50ms latency to work well across systems - tune this if you like
//             }
//             source.start(nextTime);
//             nextTime += source.buffer.duration - 0.05;
//         });
//     });
//     stream.on('end', function () {
//         console.log('end');
//     });
// });









// ! chunks play with async await 
// let socket = io.connect('http://localhost:8080/');
// var audioContext = new (window.AudioContext || window.webkitAudioContext)();
// socket.emit('client-stream-request', 'Aman Khan Silawat');
// let parts = [];
// let startTime = 0;

// ss(socket).on('audio-stream', function (stream, data) {
//     stream.on('data', function (chunk) {
//         // audioContext.decodeAudioData(chunk.buffer, function (buffer) {
//             parts.push(chunk)
//         // });
//     });
//     stream.on('end', function () {
//         console.log('end');
//         console.log(parts);
//         createSoundSource(parts)

//         // {
//         //     let buffer = parts[0];
//         //     var source = audioContext.createBufferSource();
//         //     console.log(parts[0]);
//         //     console.log();
//         //     source.buffer = buffer;
//         //     source.connect(audioContext.destination);
//         //     source.start(0);
//         // }

//         // startTime += buffer.duration;
//     });
// });

// async function createSoundSource(audioData) {
//     await Promise.all(
//         audioData.map(async (chunk) => {
//             const soundBuffer = await audioContext.decodeAudioData(chunk.buffer);
//             const soundSource = audioContext.createBufferSource();
//             soundSource.buffer = soundBuffer;
//             soundSource.connect(audioContext.destination);
//             soundSource.start(startTime);
//             startTime += soundBuffer.duration;
//         });
//     );
// }






// let socket = io.connect('http://localhost:8080/');
// socket.emit('message', 'Aman Khan Silawat');

// let audioContext = new AudioContext();
// let startTime = 0;
// let tru = 1

// socket.on('message', function (data) {
//     audioContext.decodeAudioData(data.buffer, function (buffer) {
//         if (tru <= 99) {

//             var source = audioContext.createBufferSource();
//             source.buffer = buffer;
//             source.connect(audioContext.destination);

//             source.start(startTime);
//             startTime += buffer.duration;
//             console.log(buffer.duration)
//             tru++;
//         }
//     });
// });







// setTimeout(() => {
//     if (audioContext.state === 'running') {
//         // audioContext.suspend().then(function () {
//             console.log(audioContext);

//             let osc = audioContext.createOscillator();
//             osc.connect(audioContext.destination);

//             /* Schedule the start and stop times for the oscillator */

//             osc.start();
//             osc.stop();

//             console.log(audioContext);
//         // });
//         // setTimeout(() => {
//         //     if (audioContext.state === 'suspended') {
//         //         audioContext.resume().then(function () {
//         //             console.log(audioContext);
//         //         });
//         //     }
//         // }, 2000);
//     }
// }, 3000)







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
