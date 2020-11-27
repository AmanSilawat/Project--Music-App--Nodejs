const utils = {
    playlist: function getAlbumData(type, title, data) {
        // console.log(type, title, data);

        let dom = `
            <div class="listGroup">
                <div class="title">${title}</div>
                    <ul class="listGrid">`;

        switch (type) {
            case 'song':
                return this.genrateDOM(dom, title, data);
                break;

            case 'folder':
                return this.genrateDOM(dom, title, data);
                break;
        
            default:
                console.log('something went wrong!');
                break;
        }
    },

    genrateDOM: function createHtmlElement(dom, title, data) {
        console.log(data);
        for (const item in data) {
            dom += `
            <li class="listItem">
                <a href="${title}/${data[item]}" data-playist="playlist1-code">
                    <img src="./assets/images/arzoo-e-rahamat.jpg" alt="img" />
                    <div class="albumName">${data[item]}</div>
                </a>
            </li>
            `;
        }
        dom += `</ul></div>`;
        return dom;
    }
}

export default utils;
