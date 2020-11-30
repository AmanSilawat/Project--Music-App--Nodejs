class MusicAppView {
    constructor(musicDir, pageType) {
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
        }
        // add info in Elements
        this.el.listGroup.classList.add('listGroup');
        this.el.listGroupHead.classList.add('listGroup');
        this.el.listGrid.classList.add('listGrid');
        this.el.listItem.classList.add('listItem');
        this.el.listAnchor.classList.add('listAnchor');
        this.el.imgWrap.classList.add('imgWrap');
        this.el.songImg.classList.add('songImg');
        this.el.songImg.src = './assets/images/loading.gif';
        this.el.songImg.alt = 'img';
        this.el.albumName.classList.add('albumName');

        this.trackData = null;

        // call function according to type
        switch (pageType) {
            case 'home_page':
                for (const item of musicDir) {
                    let x = this.setDesignView(item.name, item.type, item.children);
                    this.el.container.appendChild(x)
                }
                break;

            case 'inner_page':
                console.log('inner_page');
                this.setDesignView(musicDir.name, musicDir.type, musicDir.children);
                break;

            default:
                console.log('something went wrong!');
                break;
        }
    }

    setDesignView(name, dirType, children) {
        switch (dirType) {
            case 'song':
                return this.genrateDOM(name, children);
                break;

            case 'folder':
                return this.genrateDOM(name, children);
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
        listGroupHead.textContent = heading;
        listGroup.appendChild(listGroupHead);

        for (const gridItem of children) {
            switch (gridItem.type) {
                case 'folder':
                    this.handleFolder(heading, gridItem, listGrid);
                    break;

                case 'track':
                    this.handleTrack(heading, gridItem, listGrid)
                    break;

                default:
                    break;
            }
        }
        listGroup.appendChild(listGrid);
        return listGroup;
    }

    handleFolder(heading, gridItem, listGrid) {
        // clone node
        const listItem = this.el.listItem.cloneNode(true);
        const listAnchor = this.el.listAnchor.cloneNode(true);
        const imgWrap = this.el.imgWrap.cloneNode(true);
        const songImg = this.el.songImg.cloneNode(true);
        const albumName = this.el.albumName.cloneNode(true);

        const noSpaceImgName = gridItem.name.replace(/ /g, '-');

        // access clone node
        listAnchor.href = `${heading}/${noSpaceImgName}`;
        songImg.setAttribute('data-img', noSpaceImgName);
        albumName.textContent = gridItem.name;

        // append all nodes
        imgWrap.appendChild(songImg);
        listAnchor.append(imgWrap, albumName);
        listItem.appendChild(listAnchor);
        listGrid.appendChild(listItem);

        this.loadImg(heading, gridItem.name, songImg, 'folder');
    }

    handleTrack(heading, gridItem, listGrid) {
        // clone node
        for (const track of gridItem.tracks) {
            const listItem = this.el.listItem.cloneNode(true);
            const listAnchor = this.el.listAnchor.cloneNode(true);
            const imgWrap = this.el.imgWrap.cloneNode(true);
            const songImg = this.el.songImg.cloneNode(true);
            const albumName = this.el.albumName.cloneNode(true);

            const trackTrim = track.replace(/\.mp3/, '.jpg');

            // access clone node
            listAnchor.href = `javascript:void(0)`;
            listAnchor.setAttribute('data-tracklist', `${heading}/${track}`);
            imgWrap.setAttribute('data-tracklist', `${heading}/${track}`);
            songImg.setAttribute('data-tracklist', `${heading}/${track}`);
            albumName.setAttribute('data-tracklist', `${heading}/${track}`);
            albumName.textContent = track.replace(/(-)|(.mp3)/g, ' ').trim();

            // append all nodes
            imgWrap.appendChild(songImg);
            listAnchor.append(imgWrap, albumName);
            listItem.appendChild(listAnchor);
            listGrid.appendChild(listItem);

            this.loadImg(heading, trackTrim, songImg, 'track');
        }
    }

    async loadImg(heading, folderName, songImg, requestType) {
        switch (requestType) {
            case 'folder':
                var get_jsonData = await fetch(`./assets/data/${heading}/${folderName}/info.json`);
                var imgData = await get_jsonData.json();
                var imgName = imgData.thumbnail_name;
                break;

            case 'track':
        
                if (this.trackData == null) {
                    var get_jsonData = fetch(`./assets/data/${heading}/info.json`);
                    get_jsonData.then((res=> {
                        return res.json();
                    })).then(data=> {
                        this.trackData = data.trackImg;
                    });
                } else {

                }
                // var imgName = imgData.thumbnail_name;
                var imgName = folderName;
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