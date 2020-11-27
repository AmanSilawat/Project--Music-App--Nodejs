import Utils from '../services/utils.js';
let mainEle = document.getElementById('container');

document.addEventListener('DOMContentLoaded', async function musicDirData(params) {
    const reqMusicDir = await fetch('./getData');
    let resMusicDir = await reqMusicDir.json();
    console.log(reqMusicDir);
    console.log(resMusicDir);

    // const reqMusicDir = await fetch('./getData');
    // let resMusicDir = await reqMusicDir.json();
    // console.log(resMusicDir);

    // for (const item of resMusicDir) {
    //     mainEle.innerHTML += Utils.playlist(item.type, item.title, item.data);
    // }

});