class Queue {
    constructor(musicAppInstance) {
        this.musicApp = musicAppInstance;
        this.el = {
            playingElBody: null,
            playingElDefaultQueue: null,
            playingElFavoriteQueue: null,
            playlistActive: null,
            root: document.querySelector('.queuePanel'),
            defaultWrap: document.querySelector('.queueList'),
            favoriteWrap: document.querySelector('.favoriteWrap'),
            playlistWrap: document.querySelector('.playlistWrap')
        };
        this.visibity = false;
        this.playInfo = {
            currQueue: null,
            currIndex: null
        };
        this.default = [];
        this.favorite = [];
        this.playlist = [];

        // initialization
        this.init();
    }

    init() {
        // Listen Events
        this.eventListener();

        // queue.js is completely loaded then work this
        let drawOtherQueues = new Promise((resolve) => {
            resolve();
        });
    }

    // Listen Event's
    eventListener() {
        // Mouse Over on Queue bar
        this.el.root.addEventListener('mouseenter', (event) => this.toggleQueueBar(event, 'focus_in'));
        this.el.root.addEventListener('mouseleave', (event) => this.toggleQueueBar(event, 'focus_out'));

        // 
    }

    // Toggle Sidebar Queue 
    toggleQueueBar(e, focus_type) {
        switch (focus_type) {
            case 'focus_in':
                this.el.root.classList.remove('shortView')
                break;

            case 'focus_out':
                this.el.root.classList.add('shortView')
                break;

            default:
                break;
        }
    }

    // add to queue
    addToQueue(config) {
        const anchor_ele = this.musicApp.get_target_ancher(config.event.path, 'a');
        return this.queueValidation(config, anchor_ele);
    }

    queueValidation(config, anchor_ele) {
        // if ('tracklist' in anchor_ele.dataset) {
        let isExist;
        // already exeist in playlist then return false otherwise return node
        if (config.queueType == 'default') {
            isExist = this.default.includes(anchor_ele.dataset.tracklist);
        } else if (config.queueType == 'favorite') {
            isExist = this.favorite.includes(anchor_ele.dataset.tracklist)
        } else if (config.queueType == 'playlist') {
            isExist = this.playlist.includes(anchor_ele.dataset.img)
        }
        if (isExist == false) {
            let musicNodes = [];
            let trackPath;
            let getIndex;

            if (config.queueType == 'playlist') {
                let liAncher = this.createQueueNodes(config, anchor_ele, null, 'folderEl');
                let ul = document.createElement('ul');
                liAncher.classList.add('innerTracks');
                liAncher.classList.add('deActive');

                for (const track of config.allTracks) {
                    musicNodes.push(this.createQueueNodes(config, anchor_ele, track));
                    trackPath = anchor_ele.dataset['img'];
                    ul.append(...musicNodes);
                    getIndex = this.playlist.push(trackPath);
                }
                liAncher.appendChild(ul)
                this.el.playlistWrap.appendChild(liAncher);

            } else {
                musicNodes.push(this.createQueueNodes(config, anchor_ele));
                trackPath = anchor_ele.dataset['tracklist'];
            }

            if (config.queueType == 'default') {
                this.el.defaultWrap.appendChild(musicNodes[0]);
                getIndex = this.default.push(trackPath);
            } else if (config.queueType == 'favorite') {
                this.el.favoriteWrap.appendChild(musicNodes[0]);
                getIndex = this.favorite.push(trackPath);
            }

            // usefull for other queues/
            if (config.isPlay == true) { // only play

                // remove playing class previes element and add current element
                if (config.queueType == 'default') {
                    this.playInfo.currQueue = 'default';
                } else if (config.queueType == 'favorite') {
                    this.playInfo.currQueue = 'favorite';
                }

                this.playInfo.currIndex = getIndex - 1;
            } else {
                this.changeActiveState(config, anchor_ele, musicNodes[0].firstChild);
                return; // nothing do any thing
            }
            this.changeActiveState(config, anchor_ele, musicNodes[0].firstChild);
            return 'chnageMusic';
        } else {
            if (config.queueType == 'default') {
                if (anchor_ele.classList.contains('playing') == true) {
                    return 'onlyPlayPause';
                } else {
                    // change music on added queue
                    if (config.isPlay == true) {
                        let mainNode = (anchor_ele.classList.contains('listAnchor') == true) ?
                            anchor_ele :
                            this.musicApp.el.container.querySelector(`a[data-tracklist="${anchor_ele.dataset['tracklist']}"]`);

                        // get playing node into queue
                        let queueNode = (anchor_ele.classList.contains('queueItem') == true) ?
                            anchor_ele :
                            this.el.root.querySelector(`a[data-tracklist="${anchor_ele.dataset['tracklist']}"]`);

                        // remove playing class previes element and add current element
                        this.changeActiveState(config, mainNode, queueNode);
                        return 'chnageMusic'; // change music
                    }
                    // alert("It's already added!")
                }
            } else if (config.queueType == 'favorite') {
                const queueNode = anchor_ele;
                const mainNode = this.musicApp.el.container.querySelector(`a[data-tracklist="${anchor_ele.dataset.tracklist}"]`);
                if (
                    anchor_ele.classList.contains('commDef') != true &&
                    anchor_ele.classList.contains('playing') != true
                ) {
                    this.changeActiveState(config, mainNode, queueNode);
                    return 'chnageMusic';
                } else if (anchor_ele.classList.contains('playing') == true) {
                    return 'onlyPlayPause';
                } else {
                    alert('Already Added');
                    return false; // nothing do any thing
                }
            }
        }
        // }
        // return false;  // nothing do any thing
    }

    // revove to queue
    removeToQueue(e) {
        let wrapperMusicNodes = this.musicApp.get_target_ancher(e.path, 'a');

        // remove on DOM
        let rootMusicEl = wrapperMusicNodes.parentElement;
        rootMusicEl.remove();

        let wrapElement = this.musicApp.get_target_ancher(e.path, '.queueList');
        // remove on queue
        if (wrapElement.classList.contains('defaultWrap') == true) {
            let indexPos = this.default.indexOf(wrapperMusicNode.dataset.tracklist);
            this.default.splice(indexPos, 1);
        } else if (wrapElement.classList.contains('favoriteWrap') == true) {
            let indexPos = this.favorite.indexOf(wrapperMusicNode.dataset.tracklist);
            this.favorite.splice(indexPos, 1);
        }

    }

    // remove active playing class
    changeActiveState(config, mainNode, queueNode) {
        // remove playing class to all placeses
        if (this.el.playingElBody != null) {
            this.el.playingElBody.classList.remove('playing');

            const defaultWrapEl = this.el.defaultWrap.querySelector('.playing');
            const favoriteWrapEl = this.el.favoriteWrap.querySelector('.playing');

            if (defaultWrapEl != null) {
                defaultWrapEl.classList.remove('playing')
            }

            if (favoriteWrapEl != null) {
                favoriteWrapEl.classList.remove('playing')
            }
        }

        // add playing class from all matched content
        const defaultWrapEl = this.el.defaultWrap.querySelector(`a[data-tracklist="${queueNode.dataset.tracklist}"]`);
        const favoriteWrapEl = this.el.favoriteWrap.querySelector(`a[data-tracklist="${queueNode.dataset.tracklist}"]`);

        this.el.playingElBody = mainNode;
        this.el.playingElBody.classList.add('playing');

        if (defaultWrapEl != null) {
            defaultWrapEl.classList.add('playing')
        }

        if (favoriteWrapEl != null) {
            favoriteWrapEl.classList.add('playing')
        }
        // }
    }

    // Create Queue row Wrapper Element
    createQueueNodes(config, anchor_ele, track = null, folderEl = null) {
        let musicPath;
        let heading;
        let onlyDataset = false;
        if (config.queueType == 'playlist' && track != null) {
            musicPath = track;
            heading = track.replace(/.mp3$/, '').replace(/-/g, ' ');
        } else if (folderEl != null) {
            musicPath = anchor_ele.dataset.img;
            heading = anchor_ele.querySelector('.gridHead').textContent;
            onlyDataset = true;
        } else {
            musicPath = anchor_ele.dataset.tracklist;
            heading = anchor_ele.querySelector('.gridHead').textContent;
        }
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
        a.classList.add('queueItem');

        if (config.queueType == 'default') {
            a.classList.add('commDef');
        }

        a.href = 'javascript:void(0)';
        queueThumb.className += 'queueThumb material-icons';
        trackName.className += 'trackName gridHead';
        removeBtn.className += 'removeBtn material-icons';

        img.className += 'blobImg';

        moreOpt.className += 'moreOpt material-icons';
        removeBtn.textContent = 'close';
        moreOpt.textContent = 'more_vert';

        // set dataset hasAttribute
        if (onlyDataset == true) {
            a.dataset.playlistGrp = musicPath;
            queueThumb.dataset.playlistGrp = musicPath;
            img.dataset.playlistGrp = musicPath;
            trackName.dataset.playlistGrp = musicPath;
        } else {
            a.dataset.tracklist = musicPath;
            queueThumb.dataset.tracklist = musicPath;
            img.dataset.tracklist = musicPath;
            trackName.dataset.tracklist = musicPath;
        }


        img.src = anchor_ele.querySelector('.blobImg').src;
        trackName.textContent = heading;

        // append all Elements
        queueThumb.appendChild(img);

        // backBtn for playlist 
        if (folderEl != null) {
            let backBtn = document.createElement('div');
            backBtn.classList += 'backBtn material-icons';
            backBtn.textContent = 'arrow_back';
            queueThumb.appendChild(backBtn);
        }

        a.append(queueThumb, trackName, removeBtn, moreOpt)
        li.appendChild(a);
        return li;
    }

    // Add to favorite Queue
    toggleToFav(e, type) {
        switch (type) {
            case 'favorite':
                this.el.root.classList.toggle('favoriteActive');
                this.el.root.classList.remove('playlistActive');
                break;

            case 'playlist':
                this.el.root.classList.toggle('playlistActive');
                this.el.root.classList.remove('favoriteActive');
                break;

            default:
                break;
        }
    }

    addToFavQueue(e) {
        let defaultViewNode = this.el.favoriteWrap.querySelector('.defaultView');
        if (defaultViewNode != null) {
            defaultViewNode.remove();
        }
        const config = {
            event: e,
            isPlay: false,
            queueType: 'favorite'
        }
        this.addToQueue(config);
    }

    addToPlaylistQueue(e) {
        let defaultViewNode = this.el.playlistWrap.querySelector('.defaultView');
        const anchor_ele = this.musicApp.get_target_ancher(e.path, 'a');
        if (defaultViewNode != null) {
            defaultViewNode.remove();
        }
        const config = {
            event: e,
            isPlay: false,
            queueType: 'playlist'

        }
        // get info to anchor tag

        if (anchor_ele.dataset.img == undefined) {
            const track = anchor_ele.dataset.tracklist;
            config.allTracks = track;
            this.addToQueue(config);
        } else {
            const tracks = this.getMusicTracks(anchor_ele);
            config.allTracks = tracks;
            this.addToQueue(config);
        }


    }

    getMusicTracks(anchor_ele) {
        const testData = anchor_ele.dataset.img.split('/');
        const data = this.musicApp.musicAppViewInstance.musicDir;
        const cloneData = JSON.parse(JSON.stringify(data));

        // get current position array of object
        function findDir(data, testData) {
            if (testData.length == 0) {
                return data;
            }
            let element = testData[0];

            if (data.length != 0) {
                let firstEle = data.shift();
                if (firstEle.name == element) {
                    testData.shift()
                    return findDir(firstEle.children, testData);
                }
                return findDir(data, testData);
            }
        }

        // get all tracks
        function tracks(currDir, arr = []) {
            if (currDir.length == 0) {
                return arr;
            }
            let firstEle = currDir.shift();

            if (firstEle.type == 'folder') {
                currDir.push(firstEle.children)
                return tracks(currDir, arr);
            } else {
                try {
                    arr.push(...firstEle[0].tracks);
                } catch (error) {
                    arr.push(...firstEle.tracks);
                }
            }
            return tracks(currDir, arr);
        }

        let currDir = findDir(cloneData, testData);
        return tracks(JSON.parse(JSON.stringify(currDir)));
    }

    toggleInnerPlaylist(e) {
        // add active class
        let aTag = this.musicApp.get_target_ancher(e.path, 'a')
        aTag.parentElement.classList.toggle('deActive');

        // add back button 
        let imgTag = aTag.querySelector('.queueThumb');
        imgTag.removeAttribute('data-playlist-grp');
        // imgTag.innerHTML = '';
        imgTag.appendChild(backBtn);


    }
}
export default Queue;