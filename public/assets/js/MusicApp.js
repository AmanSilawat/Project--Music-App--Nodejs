class MusicApp {
    constructor(musicAppViewInstance, MusicAppView) {
        this.musicAppViewInstance = musicAppViewInstance;
        this.MusicAppView = MusicAppView;
        this.audio = new Audio();
        this.audioDuration = null;
        this.audioInterval = null; // assigin music progress bar setInterval
        this.dragStart = false;
        this.el = {
            playPauseBtn: document.getElementById('playPauseBtn'),
            muteBtn: document.getElementById('muteBtn'),
            loopBtn: document.getElementById('loopBtn'),
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
        };
        this.queue = {
            visibity: false,
            info: {
                currQueue: null,
                currIndex: null
            },
            default: [],
            favorite: [],
            playlist: [],
            root: document.querySelector('.queuePanel'),
            queueList: document.querySelector('.queueList')
        }
        this.init();
    }

    init() {
        // Listen all Events
        this.eventListener();

        this.audioBarMainWidth = window.getComputedStyle(this.el.audioBarMain).getPropertyValue('width').slice(0, -2);
        this.deagNDrop();

        this.audio.addEventListener('ended', (event) => this.addPrevAndNext(event));
    }

    eventListener() {
        // Listen Event on container
        document.body.addEventListener('click', this.eventHandler.bind(this), true);

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

        // Mouse Over on Queue bar
        this.queue.root.addEventListener('mouseenter', (event) => this.toggleQueueBar(event, 'focus_in'));
        this.queue.root.addEventListener('mouseleave', (event) => this.toggleQueueBar(event, 'focus_out'));
    }

    eventHandler(e) {
        e.preventDefault();

        if (e.target.hasAttribute('data-tracklist') == true) {
            this.getSong(e)
        }

        if (e.target.hasAttribute('data-img') == true) {
            this.innerContent(e);
        }

        if (e.target.classList.contains('backBtn') == true) {
            let currGroup = e.target.parentElement;
            let prevGroup = e.target.parentElement.previousElementSibling;
            currGroup.remove();
            prevGroup.classList.remove('hideGroup')
            console.log(currGroup, prevGroup);
        }

        // music grid click to show hide
        if (e.target.classList.contains('gridOpt') == true) {
            this.gridMore(e, 'showMore');
        }

        // music grid click to show hide
        if (e.target.classList.contains('closeBtn') == true) {
            this.gridMore(e, 'hideMore');
        }

        // add to queue
        if (e.target.classList.contains('addToQueue') == true) {
            this.addToQueue(e);
        }
    }

    innerContent(e) {
        let datasetStr = e.target.dataset.img;
        const datasetArr = datasetStr.split('/').map((el) => el.replace(/ /g, '-'));
        let firstVal = datasetArr[0];
        let musicTree = this.musicAppViewInstance.musicDir;

        let i = 0;
        let popedVal = datasetArr.shift();
        while (musicTree.length > i) {
            let trimed = musicTree[i].name.replace(/ /g, '-');

            if (trimed == popedVal) {
                if (datasetArr.length == 0) {
                    musicTree = musicTree[i];
                    break;
                }
                musicTree = musicTree[i].children;
                popedVal = datasetArr.shift() || false;
                i = 0;
                continue;
            }
            i++;
        }
        const prevPageDetail = {
            prevPath: datasetStr,
            currGroup: e.path.find((el) => el.classList.contains('listGroup'))
        }
        const musicAppView = new this.MusicAppView(musicTree, 'inner_page', prevPageDetail);
    }

    // goto to parent element then search img
    get_target_ancher(ePath) {
        for (const ele of ePath) {
            if (ele.tagName.toLowerCase() == 'a') {
                return ele;
            }
        }
    }

    getSong(e) {
        let musicName = e.target.dataset.tracklist;
        let ePath = Array.from(e.path);
        let blobImg = this.get_target_ancher(ePath).querySelector('.songImg').src;

        // set audio source info
        if (typeof musicName != 'undefined') {
            this.audio.dataset.imgSrc = blobImg;
            this.audio.title = musicName.match(/\/(.*)\.mp3$/)[1].replace(/-/g, ' ');
            this.audio.src = `./assets/data/${musicName}`;

            console.dir(this.audio);

            // abc();
            // function abc() {
            //     // let socket = io('/');
            //     let socket = io.connect('http://localhost:8080/');
            //     socket.emit('message', 'Aman Khan Silawat');

            //     socket.on('message', (encodedData) => {
            //         // const buffer = new ArrayBuffer(encodedData);
            //         // console.log(buffer.toString('base64'));
            //         // var text = "Example text to appear on clipboard";
            //         navigator.clipboard.writeText(encodedData).then(function () {
            //             console.log('Async: Copying to clipboard was successful!');
            //         }, function (err) {
            //             console.error('Async: Could not copy text: ', err);
            //         });

            //     });
            // }



            // song();
            async function song() {
                let response = await fetch('./assets/data/singer/owais-raza-qadri/nabi-ka-jashn-aya.mp3')
                let arrayBuffer = await response.arrayBuffer();
                console.log(arrayBuffer)

                var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                let source = audioCtx.createBufferSource();

                audioCtx.decodeAudioData(arrayBuffer, function (buffer) {
                    source.buffer = buffer;
                    console.log(buffer);
                    console.log(source);

                    source.connect(audioCtx.destination);
                    source.loop = true;
                    // start the source playing
                    source.start();
                });
            }


            // this.musicStateChange();
            // this.addToQueue(e, true);
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
            this.el.musicThumbnil.src = this.audio.dataset.imgSrc;

            // activePlayer
            if (this.queue.visibity == false) {
                let main = document.querySelector('.main');
                this.queue.visibity = true;
                this.el.playerPanel.classList.add('activePlayer');
                this.queue.root.classList.add('activePlayer');
                main.classList.add('activePlayer');
            }

            this.el.imgEff.classList.add('activePlayer');
            this.el.imgEff.style.backgroundImage = `url(${this.audio.dataset.imgSrc})`;
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

    // click on more button in grid
    gridMore(e, type) {

        switch (type) {
            case 'showMore':
                e.target.parentElement.classList.add('active');
                break;

            case 'hideMore':
                e.target.parentElement.parentElement.classList.remove('active');
                break;

            default:
                break;
        }
    }

    toggleQueueBar(e, focus_type) {
        switch (focus_type) {
            case 'focus_in':
                this.queue.root.classList.remove('shortView')
                break;

            case 'focus_out':
                this.queue.root.classList.add('shortView')
                break;

            default:
                break;
        }
    }

    // add to queue
    addToQueue(e, curr_play_state = false) {
        const anchor_ele = this.get_target_ancher(Array.from(e.path));
        if ('tracklist' in anchor_ele.dataset) {
            // append queue in queue list
            this.queue.queueList.appendChild(this.queue_track(anchor_ele));

            // add info current PLAYING track in Queue
            if (curr_play_state == true) {
                const trackPath = anchor_ele.dataset['tracklist'];
                const getIndex = this.queue.default.push(trackPath);
                this.queue.info.currQueue = 'default';
                this.queue.info.currIndex = getIndex - 1;
            } else {
                const trackPath = anchor_ele.dataset['tracklist'];
                this.queue.default.push(trackPath);
            }
        }
    }

    queue_track(anchor_ele) {
        // create elements
        const li = document.createElement('li');
        const a = document.createElement('a');
        const queueThumb = document.createElement('div');
        const img = document.createElement('img');
        const trackName = document.createElement('div');
        const removeBtn = document.createElement('div');
        const moreOpt = document.createElement('div');

        // set info in elements
        li.className += 'rowTrack';
        a.className += 'queueItem';
        a.href = 'javascript:void(0)';
        queueThumb.className += 'queueThumb';
        trackName.className += 'trackName';
        removeBtn.className += 'removeBtn material-icons';
        moreOpt.className += 'moreOpt material-icons';
        removeBtn.textContent = 'close';
        moreOpt.textContent = 'more_vert';

        img.src = anchor_ele.querySelector('.songImg').src;
        trackName.textContent = anchor_ele.querySelector('.albumName').textContent;

        // append all Elements
        queueThumb.appendChild(img);
        a.append(queueThumb, trackName, removeBtn, moreOpt)
        li.appendChild(a);
        return li;
    }

    addPrevAndNext(event) {
        const currQueue = this.queue.info.currQueue;
        // check what's queue currently running
        if (currQueue != null) {
            const currIndex = this.queue.info.currIndex;
            console.log(this.queue[currQueue], currIndex);
            console.log(this.queue[currQueue][currIndex]);
            if (typeof this.queue[currQueue][currIndex] != undefined) {
                const nextSong = this.queue[currQueue][currIndex + 1];
                console.log(nextSong)
                this.audio.src = `./assets/data/${nextSong}`;
                this.audio.load();
                this.musicStateChange();

            } else {
                console.log('else Part')
            }
        }
    }
}

export default MusicApp;
