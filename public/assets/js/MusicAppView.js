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
        }
        // add info in Elements
        this.el.listGroup.classList.add('listGroup');
        this.el.listGroupHead.classList.add('title');
        this.el.listGrid.classList.add('listGrid');
        this.el.listItem.classList.add('listItem');
        this.el.listAnchor.classList.add('listAnchor');
        this.el.imgWrap.classList.add('imgWrap');
        this.el.songImg.classList.add('songImg');
        this.el.songImg.src = './assets/images/loading.gif';
        this.el.songImg.alt = 'img';
        this.el.albumName.classList.add('albumName');

        // extra variable
        this.prevPageDetail = prevPageDetail;
        this.trackData = null;
        this.musicDir = musicDir;

        // call function according to type
        switch (pageType) {
            case 'home_page':
                for (const item of this.musicDir) {
                    console.log(item)
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
                    this.handleFolder(heading, gridItem, listGrid, listGroup);
                    break;

                case 'track':
                    this.handleTrack(heading, gridItem, listGrid, listGroup)
                    break;

                default:
                    break;
            }
        }
        listGroup.appendChild(listGrid);
        return listGroup;
    }

    handleFolder(heading, gridItem, listGrid, listGroup) {
        // clone node
        const listItem = this.el.listItem.cloneNode(true);
        const listAnchor = this.el.listAnchor.cloneNode(true);
        const imgWrap = this.el.imgWrap.cloneNode(true);
        const songImg = this.el.songImg.cloneNode(true);
        const albumName = this.el.albumName.cloneNode(true);

        const noSpaceImgName = gridItem.name.replace(/ /g, '-');

        // access clone node
        // listAnchor.href = `javascript:void(0)`;
        // listAnchor.href = `${heading}/${noSpaceImgName}`;
        listAnchor.setAttribute('data-img', `${heading}/${noSpaceImgName}`);
        songImg.setAttribute('data-img', `${heading}/${noSpaceImgName}`);
        albumName.setAttribute('data-img', `${heading}/${noSpaceImgName}`);
        imgWrap.setAttribute('data-img', `${heading}/${noSpaceImgName}`);
        imgWrap.classList.add('material-icons');
        albumName.textContent = gridItem.name.replace(/-/g, ' ');
        listGroup.classList.add('playlist')

        // append all nodes
        imgWrap.appendChild(songImg);
        listAnchor.append(imgWrap, albumName);
        listItem.appendChild(listAnchor);
        listGrid.appendChild(listItem);

        this.loadImg(heading, gridItem.name, songImg, 'folder');
    }

    handleTrack(heading, gridItem, listGrid, listGroup) {
        // clone node
        for (const track of gridItem.tracks) {
            const listItem = this.el.listItem.cloneNode(true);
            const listAnchor = this.el.listAnchor.cloneNode(true);
            const imgWrap = this.el.imgWrap.cloneNode(true);
            const songImg = this.el.songImg.cloneNode(true);
            const albumName = this.el.albumName.cloneNode(true);

            const trackTrim = track.replace(/\.mp3/, '');

            // access clone node
            listAnchor.href = `javascript:void(0)`;
            // heading = heading.replace(' ', '-');
            // heading = heading ? ${heading}/${track} : heading;
            listAnchor.setAttribute('data-tracklist', `${heading}/${track}`);
            imgWrap.setAttribute('data-tracklist', `${heading}/${track}`);
            songImg.setAttribute('data-tracklist', `${heading}/${track}`);
            albumName.setAttribute('data-tracklist', `${heading}/${track}`);
            albumName.textContent = track.replace(/(-)|(.mp3)/g, ' ').trim();
            listGroup.classList.add('tracks')
            imgWrap.classList.add('material-icons');

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