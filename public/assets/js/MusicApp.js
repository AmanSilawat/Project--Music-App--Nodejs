class MusicApp {
    constructor(musicAppView) {
        this.musicAppView = musicAppView;
        this.audio = new Audio();
        this.audioDuration = null;
        this.audioInterval = null; // assigin music progress bar setInterval
        this.dragStart = false;
        this.el = {
            playPauseBtn: document.getElementById('playPauseBtn'),
            muteBtn: document.getElementById('muteBtn'),
            loopBtn: document.getElementById('loopBtn'),
            queuePanel: document.querySelector('.queuePanel'),
            totTimeState: document.getElementById('totTimeState'),
            audioTrackWrap: document.querySelector('.audioTrackWrap'),
            audioBar: document.querySelector('.currentPoint'),
            audioBarMain: document.querySelector('.audioTrack'),
            musicRowNode: document.querySelectorAll('.listGrid'),
            musicBar: document.getElementById('musicBar'),
            currTimeState: document.getElementById('currTimeState'),
            musicTitile: document.getElementById('musicTitile'),
            musicThumbnil: document.getElementById('musicThumbnil'),
            playerPanel: document.querySelector('footer'),
            imgEff: document.getElementById('playerEff'),
            listAnchor: document.querySelectorAll('a[data-img]')
        }

        // Listen Event on all music
        for (const m of this.el.musicRowNode) {
            m.addEventListener('click', this.getSong.bind(this), true);
        }

        // Listen Event on Play/Pause button
        this.el.playPauseBtn.addEventListener('click', this.playPause.bind(this));

        // Listen Event on mute button
        this.el.muteBtn.addEventListener('click', this.mute.bind(this));

        // Listen Event on loop button
        this.el.loopBtn.addEventListener('click', this.audioLoop.bind(this));

        // Listen Event on click to drage audio track
        this.el.audioTrackWrap.addEventListener('click', function (e) {
            this.seekingAudio(e.x, 'drop');
        }.bind(this));

        this.audioBarMainWidth = window.getComputedStyle(this.el.audioBarMain).getPropertyValue('width').slice(0, -2);
        this.deagNDrop();

        // inner page
        for (const anchor of this.el.listAnchor) {
            anchor.addEventListener('click', this.hasChange.bind(this));
        }
    }

    hasChange(e) {
        e.preventDefault();
        const dataset = e.target.dataset.img.split('/').map((el) => el.replace(/ /g, '-'));
        let musicTree = this.musicAppView.musicDir;

        let i = 0;
        let popedVal = dataset.shift();
        while (musicTree.length > i) {
            let trimed = musicTree[i].name.replace(/ /g, '-');

            if (trimed == popedVal) {
                if (dataset.length == 0) {
                    musicTree = musicTree[i];
                    break;
                }
                musicTree = musicTree[i].children;
                popedVal = dataset.shift() || false;
                i = 0;
                continue;
            }
            i++;
        }
    }

    getSong(e) {
        console.log();
        let musicName = e.target.dataset.tracklist;
        if (typeof musicName != 'undefined') {
            this.audio.src = `./assets/data/${musicName}`;
            this.musicStateChange();
        }
    }

    playPause(e) {
        if (this.audio.paused) {
            this.audio.play();
            this.el.playPauseBtn.innerHTML = "pause_circle_outline";
        } else {
            this.audio.pause();
            this.el.playPauseBtn.innerHTML = "play_circle_outline";
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

    musicStateChange() {
        this.audio.play().then(() => {
            this.audioDuration = this.audio.duration;

            // set time and progress bar
            this.musicProgress();
            this.audioInterval = setInterval(this.musicProgress.bind(this), 1000);

            // chnage current player thamblin and titile
            this.el.musicTitile.textContent = this.audio.title;
            this.el.musicThumbnil.src = this.audio.textContent;

            // activePlayer
            this.el.playerPanel.classList.add('activePlayer');
            this.el.queuePanel.classList.add('activePlayer');

            this.el.imgEff.classList.add('activePlayer');
            this.el.imgEff.style.backgroundImage = `url(${this.audio.textContent})`;
        });
    }

    musicProgress() {
        // total time calcualtion
        let totDuration = parseInt(this.audioDuration)
        let totMin = String(parseInt(totDuration / 60)).padStart(2, 0);
        let totSec = String(totDuration - (60 * totMin)).padStart(2, 0);

        this.el.totTimeState.innerHTML = `${totMin}:${totSec}`;

        // cuttent time calcuation
        let currDuration = parseInt(this.audio.currentTime)
        let currMin = String(parseInt(currDuration / 60)).padStart(2, 0);
        let currSec = String(currDuration - (60 * currMin)).padStart(2, 0);

        this.el.currTimeState.innerHTML = `${currMin}:${currSec}`;

        // progress bar
        if (this.dragStart == false) {
            let currDuaInPercentage = currDuration / (totDuration) * 100;
            this.el.musicBar.style.width = `${currDuaInPercentage}%`;

            // stop audio time traking
            if (this.audio.loop == false && currDuaInPercentage >= 100) {
                clearInterval(this.audioInterval);
            }
        }
    }

    changeAudioInfo() {
        // change album name & img 

        // move music duration this place
    }

    // drag and drop function
    deagNDrop() {
        // let ele = this.el.musicBar.querySelector('.draggable');
        let ele = this.el.audioTrackWrap;
        ele.addEventListener('dragstart', function (event) {
            event.dataTransfer.setData("idName", event.target.id);
            this.dragStart = true;

            var crt = event.target.cloneNode(true);
            crt.style.backgroundColor = "red";
            event.dataTransfer.setDragImage(crt, 0, 0);

        }.bind(this));

        ele.addEventListener('drag', function (event) {
            this.seekingAudio(event.x, 'drag');

        }.bind(this));

        /* events fired on the drop targets */
        document.addEventListener("dragover", function (event) {
            // prevent default to allow drop
            event.preventDefault();
        }, false);

        window.addEventListener('drop', function (event) {
            this.dragStart = false;
            if (event.dataTransfer.getData('idName') == 'draggableContent') {
                event.preventDefault();
                this.seekingAudio(event.x, 'drop');
            }
        }.bind(this));
    }

    seekingAudio(xPos, type) {
        let getPer;
        switch (type) {
            case 'drop':
                getPer = (xPos / this.audioBarMainWidth) * 100;
                this.audio.currentTime = this.audioDuration * (getPer / 100);
                this.musicProgress();
                break;

            case 'drag':
                getPer = (xPos / this.audioBarMainWidth) * 100;
                this.el.audioBar.style.width = `${getPer}%`;
                break;

            default:
                console.log('Somting went worng');
                break;
        }
    }
}

export default MusicApp;
