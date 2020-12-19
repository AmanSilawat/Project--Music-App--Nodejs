class Queue {
    constructor(musicAppInstance) {
        this.musicApp = musicAppInstance;
        this.el = {
            mainActive: null,
            defaultActive: null,
            favoriteActive: null,
            playlistActive: null,
            root: document.querySelector('.queuePanel'),
            queueList: document.querySelector('.queueList'),
            favWrap: document.querySelector('.favWrap')
        };
        this.visibity = false;
        this.info = {
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

        // drawOtherQueues.then(() => {
        //     this.drawOtherQueues();
        // });
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

        if ('tracklist' in anchor_ele.dataset) {
            // already exeist in playlist then return false otherwise return node
            let isMusicNode = this.queue_track(anchor_ele);

            if (isMusicNode !== false) {
                switch (config.queueType) {
                    case 'default':
                        this.el.queueList.appendChild(isMusicNode);
                        break;

                    case 'favorite':
                        this.el.favWrap.appendChild(isMusicNode);
                        break;
                
                    default:
                        break;
                }

                // remove playing class previes element and add current element
                if (config.appendNPlay == true) {
                    this.changeActiveState(anchor_ele, isMusicNode.firstChild);
                }

                const trackPath = anchor_ele.dataset['tracklist'];
                const getIndex = this.default.push(trackPath);

                this.info.currQueue = 'default';
                this.info.currIndex = getIndex - 1;

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

        // remove on queue
        let indexPos = this[this.info.currQueue].indexOf(wrapperMusicNode.dataset.tracklist);
        this[this.info.currQueue].splice(indexPos, 1);
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
    queue_track(anchor_ele) {
        let musicPath = anchor_ele.dataset.tracklist;

        let currQue = this.info.currQueue;
        if (currQue == null) {
            return addMusicNode(musicPath)
        } else if (this[currQue].includes(musicPath) != true) {
            return addMusicNode(musicPath);
        }

        // add music node
        function addMusicNode() {
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
        return false;
    }

    // Add to favorite Queue
    toggleToFav(e) {
        this.el.root.classList.toggle('favoriteActive');
    }

    addToFavQueue(e) {
        let defaultViewNode = this.el.favWrap.querySelector('.defaultView')
        if (defaultViewNode != null) {
            defaultViewNode.remove();
        }
        const config = {
            event: e,
            appendNPlay: false,
            queueType: 'favorite'
        }
        // this.addToQueue(config); 
    }
}
export default Queue;