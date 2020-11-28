const express = require('express');
// using for run linux commend with async...
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const app = express();

const playlist = {};
const tracklist = {};

async function main(res) {
    // get list of songs using shell command
    const { stdout, stderr } = await exec("find ./public/assets/data -iname '*.mp3' -print");

    // handle error
    if (stderr) {
        console.error(`error: ${stderr}`);
    }

    // get usefull data on songs list
    const songListArr = JSON.stringify(stdout).replace(/(^"\.\/public\/assets\/data\/)|(\\n)|(")/gi, '').split('./public/assets/data/');
    console.log(songListArr);

    // // single array split
    // const songListStr = JSON.stringify(stdout)
    //     .replace(/(\.\/public\/assets\/data\/)|(")/gi, '')
    //     .replace(/(\\n)/gi, '/');
    // const songListArr = songListStr.split('/');

    // function recursion(arr, index = 0, result = []) {
    //     if (arr.length == 0) {
    //         return result;
    //     }
    //     const firstVal = arr.shift();
    //     console.log(firstVal, '-------------------------------------------');

    //     if (firstVal.match(/.mp3$/i) == null) {
    //         // if (result[index].title != firstVal) {
    //         try {
    //             result[index].title.push(firstVal);
    //             result[index].type.push('playlist');
    //             result[index].list.push([]);
    //             index++;
    //         } catch (e) {
    //             result[index] = {};
    //             result[index].title = firstVal;
    //             result[index].type = 'playlist';
    //             result[index].list = [];
    //             index++;
    //         }
    //     }
    //      else {
    //         try {
    //             // result[index].type.push('tracklist');
    //             // result[index].list.push([]);
    //             // index = 0;
    //         } catch (e) {
    //             // result[index] = {};
    //             // result[index].type = 'tracklist';
    //             // result[index].list = [];
    //             // index = 0;
    //         }
    //     }

    //     return recursion(arr, index, result);
    // }
    // console.log(recursion(songListArr));



    // // multiArray
    let data = [];
    songListArr.forEach((songPath, mainIndex) => {
        const splitSongPath = songPath.split('/');
        // console.log(splitSongPath);
        splitSongPath.forEach((path, innerIndex) => {
            // console.log(path, '-----');
            // console.log(data[data.length.title - 1]);
            // if (data[data.length - 1].title == undefined) {
            try {
                data[data.length - 1].title.push(path);
                data[data.length - 1].type.push('folder');
                data[data.length - 1].list.push([]);
                // innerIndex++;
            } catch (e) {
                data.push({});
                data[data.length - 1].title = path;
                data[data.length - 1].type = 'folder';
                data[data.length - 1].list = [];
                console.log('--------------------------');
                console.log(path);
                // result = data[data.length - 1].list
            }
        });
    });
    console.log(data);

    // res.send(songListArr);
}

main();

// set the view engine to ejs
app.set('view engine', 'ejs');

// setup public folder
app.use(express.static('./public'));

// index page
app.get('/', function setRootDir(req, res) {
    res.render('index');
});

app.get('/getData', function getDa(req, res) {
    main(res);
});

console.log('First Load');
app.listen(8080);
