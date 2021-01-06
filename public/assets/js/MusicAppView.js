class MusicAppView {
    constructor(musicDir, pageType, prevPageDetail = undefined) {
        // create Element
        this.el = {
            container: document.getElementById('container'),
            listGroup: document.createElement('div'),
            listGroupHead: document.createElement('div'),
            listGrid: document.createElement('ul'),
            listItem: document.createElement('li'),
            listAnchor: document.createElement('a'),
            imgWrap: document.createElement('div'),
            songImg: document.createElement('img'),
            albumName: document.createElement('div'),
            gridMoreOpt: document.createElement('div')
        }
        // add info in Elements
        this.el.listGroup.classList.add('listGroup');
        this.el.listGroupHead.classList.add('title');
        this.el.listGrid.classList.add('listGrid');
        this.el.listItem.classList.add('listItem');
        this.el.listAnchor.classList.add('listAnchor');
        this.el.listAnchor.classList.add('uniqeKey');
        this.el.listAnchor.classList.add('commDef');
        this.el.imgWrap.classList.add('imgWrap');
        this.el.songImg.classList.add('songImg');
        this.el.songImg.classList.add('blobImg');
        this.el.songImg.src = './assets/images/loading.gif';
        this.el.songImg.alt = 'img';
        this.el.albumName.classList.add('albumName');
        this.el.albumName.classList.add('gridHead');

        // extra variable
        this.prevPageDetail = prevPageDetail;
        this.trackData = null;
        this.musicDir = musicDir;

        this.init();

        // call function according to type
        switch (pageType) {
            case 'home_page':
                for (const item of this.musicDir) {
                    let x = this.setDesignView(item.name, item.type, item.children);
                    this.el.container.appendChild(x)
                }
                break;

            case 'inner_page':
                let currentGroup = this.setDesignView(this.prevPageDetail.prevPath, musicDir.type, musicDir.children);

                // // add back button
                let backBtn = document.createElement('div')
                backBtn.className += 'backBtn material-icons';
                backBtn.textContent = 'arrow_back';
                currentGroup.insertAdjacentElement('afterbegin', backBtn);

                this.prevPageDetail.currGroup.classList.add('hideGroup');
                this.prevPageDetail.currGroup.insertAdjacentElement('afterend', currentGroup);
                break;

            default:
                console.log('something went wrong!');
                break;
        }
    }

    init() {
        // more options div on music grid
        let fav = document.createElement('span');
        let favPlaylist = document.createElement('span');
        let addToQueue = document.createElement('span');
        let closeBtn = document.createElement('span');

        this.el.gridMoreOpt.className += 'gridOpt material-icons';
        fav.className += 'myFav material-icons';
        favPlaylist.className += 'favPlaylist material-icons';
        // favPlaylist.dataset.popup = 'playlistPopup';
        closeBtn.className += 'closeBtn material-icons';
        addToQueue.classList += 'addToQueue material-icons';

        fav.setAttribute('title', 'Add Favorite');
        favPlaylist.setAttribute('title', 'Add to Playlist');
        addToQueue.setAttribute('title', 'Add to Queue');
        closeBtn.setAttribute('title', 'Close');
        // make tooltip


        this.el.gridMoreOpt.append(favPlaylist, fav, addToQueue, closeBtn);

        // set popup
        
    }
    

    setDesignView(name, dirType, children) {
        switch (dirType) {
            case 'song':
                return this.genrateDOM(name, children, dirType);
                break;

            case 'folder':
                return this.genrateDOM(name, children, dirType);
                break;

            default:
                console.log('something went wrong!');
                break;
        }
    }

    genrateDOM(heading, children) {
        // clone node
        const listGroupHead = this.el.listGroupHead.cloneNode(true);
        const listGroup = this.el.listGroup.cloneNode(true);
        const listGrid = this.el.listGrid.cloneNode(true);

        // access clone node
        listGroupHead.textContent = heading.replace(/.*?\//gi, '').replace(/-/g, ' ');;
        listGroup.appendChild(listGroupHead);

        for (const gridItem of children) {
            switch (gridItem.type) {
                case 'folder':
                    this.handleFolder({heading, gridItem, listGrid, listGroup});
                    break;

                case 'track':
                    this.handleTrack({heading, gridItem, listGrid, listGroup})
                    break;

                default:
                    break;
            }
        }
        listGroup.appendChild(listGrid);
        return listGroup;
    }

    handleFolder(config) {
        let domConfig = this.trackAndFolder(config.listGrid);

        const noSpaceImgName = config.gridItem.name.replace(/ /g, '-');

        // access clone node
        domConfig.listAnchor.setAttribute('data-img', `${config.heading}/${noSpaceImgName}`);
        domConfig.songImg.setAttribute('data-img', `${config.heading}/${noSpaceImgName}`);
        domConfig.imgWrap.setAttribute('data-img', `${config.heading}/${noSpaceImgName}`);
        domConfig.albumName.setAttribute('data-img', `${config.heading}/${noSpaceImgName}`);
        domConfig.albumName.textContent = config.gridItem.name.replace(/-/g, ' ');
        config.listGroup.classList.add('playlist');

        this.loadImg(config.heading, config.gridItem.name, domConfig.songImg, 'folder');
    }

    handleTrack(config) {
        // clone node
        for (const track of config.gridItem.tracks) {
            let domConfig = this.trackAndFolder(config.listGrid);

            domConfig.listAnchor.href = `javascript:void(0)`;
            // access clone node
            domConfig.listAnchor.setAttribute('data-tracklist', `${config.heading}/${track}`);
            domConfig.songImg.setAttribute('data-tracklist', `${config.heading}/${track}`);
            domConfig.imgWrap.setAttribute('data-tracklist', `${config.heading}/${track}`);
            domConfig.albumName.setAttribute('data-tracklist', `${config.heading}/${track}`);
            domConfig.albumName.textContent = track.replace(/(-)|(.mp3)/g, ' ').trim();
            config.listGroup.classList.add('tracks');

            const trackTrim = track.replace(/\.mp3/, '');
            this.loadImg(config.heading, trackTrim, domConfig.songImg, 'track');
        }
    }

    trackAndFolder(listGrid) {
        // clone node
        const listItem = this.el.listItem.cloneNode(true);
        const listAnchor = this.el.listAnchor.cloneNode(true); 
        const imgWrap = this.el.imgWrap.cloneNode(true);
        const songImg = this.el.songImg.cloneNode(true);
        const albumName = this.el.albumName.cloneNode(true);

        // more options div on music grid
        imgWrap.classList.add('material-icons');
        imgWrap.appendChild(this.el.gridMoreOpt.cloneNode(true));

        // append all nodes
        imgWrap.appendChild(songImg);
        listAnchor.append(imgWrap, albumName);
        listItem.appendChild(listAnchor);
        listGrid.appendChild(listItem);

        return {listItem, listAnchor, imgWrap, songImg, albumName};
    }

    async loadImg(heading, folderName, songImg, requestType) {
        switch (requestType) {
            case 'folder':
                var get_jsonData = await fetch(`./assets/data/${heading}/${folderName}/info.json`);
                var imgData = await get_jsonData.json();
                var imgName = imgData.main_poster;
                break;

            case 'track':
                var get_jsonData = await fetch(`./assets/data/${heading}/info.json`);
                var imgData = await get_jsonData.json();
                var imgName = imgData.trackImg[folderName];

                break;

            default:
                break;
        }

        let get_imgData = await fetch(`./assets/images/${imgName}`);
        const get_img = await get_imgData.blob();

        try {
            if (get_img.type != 'image/jpeg') {
                throw 'imgNotFound'
            } else {
                var reader = new FileReader();
                reader.readAsDataURL(get_img);
                reader.onloadend = function () {
                    var base64data = reader.result;
                    songImg.src = base64data;
                }
            }
        } catch (error) {
            songImg.src = './assets/images/no-image-available.jpg';
        }
    }
}

export default MusicAppView;