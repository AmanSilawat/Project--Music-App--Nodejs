function playSong(e) {
    let musicName;
    if ((e.path[0].tagName).toLowerCase() == 'a') {
        musicName = e.path[0].dataset.audioname;
    }
    else if ((e.path[1].tagName).toLowerCase() == 'a') {
        musicName = e.path[1].dataset.audioname;
    }
    const audioNode = new Audio(`./assets/musics/${musicName}.mp3`);

    audioNode.play()
    console.dir(audioNode);
    audioNode.paused = true;
}

const musicList = document.querySelectorAll('a[data-audioName]');

for (const music of musicList) {
    music.addEventListener('click', playSong, true);
}