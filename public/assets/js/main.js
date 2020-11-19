class MusicApp {
    constructor(musicIdentity, aud) {
        this.audio = new Audio();
        this.audioInterval = null;
        this.el = {
            playPauseBtn: document.getElementById('playPauseBtn'),
            mNodeEleList: document.querySelectorAll(musicIdentity),
            musicBar: document.getElementById('musicBar'),
            totTimeState: document.getElementById('totTimeState'),
            currTimeState: document.getElementById('currTimeState'),
            muteBtn: document.getElementById('muteBtn'),
            loopBtn: document.getElementById('loopBtn'),
        }

        // Listen Event on all music
        for (const m of this.el.mNodeEleList) {
            m.addEventListener('click', this.getSong.bind(this), true);
        }

        // Listen Event on Play/Pause button
        this.el.playPauseBtn.addEventListener('click', this.playPause.bind(this));

        // Listen Event on mute button
        this.el.muteBtn.addEventListener('click', this.mute.bind(this));

        // Listen Event on loop button
        this.el.loopBtn.addEventListener('click', this.audioLoop.bind(this));
    }

    getSong(e) {
        let musicName;
        if ((e.path[0].tagName).toLowerCase() == 'a') {
            musicName = e.path[0].dataset.audioname;
        }
        else if ((e.path[1].tagName).toLowerCase() == 'a') {
            musicName = e.path[1].dataset.audioname;
        }

        this.audio.src = `./assets/musics/${musicName}.mp3`;
        
        this.musicStateChange();
    }

    playPause(e) {
        if (this.audio.paused) {
            this.audio.play();
            this.el.playPauseBtn.innerHTML = "play_circle_outline";
        } else {
            this.audio.pause();
            this.el.playPauseBtn.innerHTML = "pause_circle_outline";
        }
    }
    
    mute(e) {
        if (this.audio.muted == false) {
            this.audio.muted = true;
            this.el.muteBtn.innerHTML = "music_off";
        } else {
            this.audio.muted = false;
            this.el.muteBtn.innerHTML = "music_note";
        }
    }

    audioLoop() {
        if (this.audio.loop == false) {
            this.audio.loop = true;
            this.el.loopBtn.innerHTML = "repeat_one";
        } else {
            this.audio.loop = false;
            this.el.loopBtn.innerHTML = "repeat";
        }
    }

    musicProgress() {
        // total time calcualtion
        let totDuration = parseInt(this.audio.duration)
        let totMin = String(parseInt(totDuration / 60) ).padStart(2, 0);
        let totSec = String(totDuration - (60 * totMin) ).padStart(2, 0);

        this.el.totTimeState.innerHTML =`${totMin}:${totSec}`;

        // cuttent time calcuation
        let currDuration = parseInt(this.audio.currentTime)
        let currMin = String(parseInt(currDuration / 60) ).padStart(2, 0);
        let currSec = String(currDuration - (60 * currMin) ).padStart(2, 0);

        this.el.currTimeState.innerHTML =`${currMin}:${currSec}`;

        // progress bar
        let currDuaInPercentage = currDuration / (totDuration ) * 100;
        this.el.musicBar.style.width = `${currDuaInPercentage}%`;

        // stop
        if (this.audio.loop == false && currDuaInPercentage >= 100) {
            clearInterval(this.audioInterval);
        }
    }

    musicStateChange() {
        this.audio.play();
        this.audioInterval = setInterval(this.musicProgress.bind(this), 1000);
        this.changeAudioInfo();
    }

    changeAudioInfo() {
        // change album name & img 

        // move music duration this place
    }

    // drag and drop function
}

let music = new MusicApp('a[data-audioName]');
