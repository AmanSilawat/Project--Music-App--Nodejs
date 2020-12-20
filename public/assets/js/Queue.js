class Queue {
    constructor(musicAppInstance) {
        this.musicApp = musicAppInstance;
        this.el = {
            mainActive: null,
            defaultActive: null,
            favoriteActive: null,
            playlistActive: null,
            root: document.querySelector('.queuePanel'),
            defaultWrap: document.querySelector('.queueList'),
            favoriteWrap: document.querySelector('.favoriteWrap')
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
        const state = this.queueValidation(config, anchor_ele);
        if (state == 'onlyPlayPause') {
            console.log('trueeeee');
        }
        return state;
    }

    queueValidation(config, anchor_ele) {
        if ('tracklist' in anchor_ele.dataset) {
            let isExist;

            // already exeist in playlist then return false otherwise return node
            if (config.queueType == 'default') {
                isExist = this.default.includes(anchor_ele.dataset.tracklist);
            } else if (config.queueType == 'favorite') {
                isExist = this.favorite.includes(anchor_ele.dataset.tracklist)
            }
            
            if (isExist != true) {

                let isMusicNode = this.createQueueNodes(config, anchor_ele);
                const trackPath = anchor_ele.dataset['tracklist'];
                let getIndex;

                if (config.queueType == 'default') {
                    this.el.defaultWrap.appendChild(isMusicNode); // diff
                    getIndex = this.default.push(trackPath); // diff
                } else if (config.queueType == 'favorite') {
                    this.el.favoriteWrap.appendChild(isMusicNode); // diff
                    getIndex = this.favorite.push(trackPath); // diff
                }

                // usefull for other queues/
                if (config.appendNPlay == true) {
                    this.changeActiveState(anchor_ele, isMusicNode.firstChild);

                    // remove playing class previes element and add current element
                    if (config.queueType == 'default') {
                        this.playInfo.currQueue = 'default'; // diff
                    } else if (config.queueType == 'favorite') {
                        this.playInfo.currQueue = 'favorite'; // diff
                    }
                    
                    this.playInfo.currIndex = getIndex - 1;
                }

                return 'chnageMusic';
            } else {
                if (anchor_ele.classList.contains('playing') == true) {
                    return 'onlyPlayPause';
                }
            }
        }

        if (config.appendNPlay != true) {
            alert("It's already added!")
        } else {
            let mainNode = (anchor_ele.classList.contains('listAnchor') == true) ?
                anchor_ele :
                this.musicApp.el.container.querySelector(`a[data-tracklist="${anchor_ele.dataset['tracklist']}"]`);

            // get playing node into queue
            let queueNode = (anchor_ele.classList.contains('queueItem') == true) ?
                anchor_ele :
                this.el.root.querySelector(`a[data-tracklist="${anchor_ele.dataset['tracklist']}"]`);

            // remove playing class previes element and add current element
            this.changeActiveState(mainNode, queueNode);
            return 'chnageMusic'; // change music
        }
    }

    // revove to queue
    removeToQueue(e) {
        let wrapperMusicNode = this.musicApp.get_target_ancher(e.path, 'a');

        // remove on DOM
        let rootMusicEl = wrapperMusicNode.parentElement;
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
    changeActiveState(mainNode, queueNode) {
        // remove playing class previes element
        if (this.el.mainActive != null) {
            this.el.mainActive.classList.remove('playing');
            this.el.defaultActive.classList.remove('playing');
        }
        // add playing Element in queue
        this.el.mainActive = mainNode;
        this.el.defaultActive = queueNode;

        // add playing class in active   queue
        this.el.mainActive.classList.add('playing');
        this.el.defaultActive.classList.add('playing');
    }

    // Create Queue row Wrapper Element
    createQueueNodes(config, anchor_ele) {
        let musicPath = anchor_ele.dataset.tracklist;
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
        queueThumb.className += 'queueThumb material-icons';
        trackName.className += 'trackName gridHead';
        removeBtn.className += 'removeBtn material-icons';

        img.className += 'blobImg';
        moreOpt.className += 'moreOpt material-icons';
        removeBtn.textContent = 'close';
        moreOpt.textContent = 'more_vert';

        // set dataset hasAttribute
        a.dataset.tracklist = musicPath;
        queueThumb.dataset.tracklist = musicPath;
        img.dataset.tracklist = musicPath;
        trackName.dataset.tracklist = musicPath;

        img.src = anchor_ele.querySelector('.blobImg').src;
        trackName.textContent = anchor_ele.querySelector('.gridHead').textContent;

        // append all Elements
        queueThumb.appendChild(img);
        a.append(queueThumb, trackName, removeBtn, moreOpt)
        li.appendChild(a);
        return li;
    }

    // Add to favorite Queue
    toggleToFav(e) {
        this.el.root.classList.toggle('favoriteActive');
    }

    addToFavQueue(e) {
        let defaultViewNode = this.el.favoriteWrap.querySelector('.defaultView')
        if (defaultViewNode != null) {
            defaultViewNode.remove();
        }
        const config = {
            event: e,
            appendNPlay: false,
            queueType: 'favorite'
        }
        this.addToQueue(config);
    }
}
export default Queue;