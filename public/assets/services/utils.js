const utils = {
    playlist: function getAlbumData(name, type, children) {
        switch (type) {
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
    },

    genrateDOM: function createHtmlElement(name, children) {
        let dom = `
            <div class="listGroup">
                <div class="title">${name}</div>
                    <ul class="listGrid">`;

        for (const row of children) {
            switch (row.type) {
                case 'folder':
                    const dataImg = row.name.replace(/ /g, '-');
                    dom += `
                    <li class="listItem">
                        <a class="listAnchor" href="${name}/${row.name}">
                            <div class="imgWrap">
                                <img class="songImg" src="./assets/images/loading.gif" data-img="${dataImg}" alt="img" />
                            </div>
                            <div class="albumName">${row.name}</div>
                        </a>
                    </li>
                    `;

                    async function folderImg() {
                        let get_jsonData = await fetch(`./assets/data/${name}/${row.name}/info.json`);
                        let imgData = await get_jsonData.json();

                        let get_imgData = await fetch(`./assets/images/${imgData.thumbnail_name}`);
                        const get_img = await get_imgData.blob();

                        let img = document.querySelector(`img[data-img='${dataImg}']`);
                        img.classList.remove('unloadImg');

                        try {
                            if (get_img.type != 'image/jpeg') {
                                throw 'imgNotFound'
                            } else {
                                var reader = new FileReader();
                                reader.readAsDataURL(get_img);
                                reader.onloadend = function () {
                                    var base64data = reader.result;
                                    img.src = base64data;
                                }
                            }
                        } catch (error) {
                            img.src = './assets/images/no-image-available.jpg';
                        }
                    }
                    folderImg();

                    break;

                case 'track':
                    for (const track of row.tracks) {
                        dom += `
                        <li class="listItem">
                            <a href="javascript:void(0)" data-tracklist="${name}/${track}">
                                <div class="imgWrap" data-tracklist="${name}/${track}">
                                    <img class="songImg" src="./assets/images/loading.gif" alt="img" data-tracklist="${name}/${track}" />
                                </div>
                                <div class="albumName" data-tracklist="${name}/${track}">${track}</div>
                            </a>
                        </li>
                        `;
                    }
                    break;

                default:
                    break;
            }
        }
        dom += `</ul></div>`;
        return dom;
    }
}

export default utils;
