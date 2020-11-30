import Utils from '../services/utils.js';
import MusicApp from './MusicApp.js';
import MusicAppView from './MusicAppView.js';

let mainEle = document.getElementById('container');

document.addEventListener('DOMContentLoaded', async function musicDirData(params) {
    const reqMusicDir = await fetch('./getData');
    const musicAppView = new MusicAppView(await reqMusicDir.json(), 'home_page');
    const musicApp = new MusicApp(musicAppView);
});
