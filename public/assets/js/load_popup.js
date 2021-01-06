import PopupJs from './PopupJs.js';
let popupBody = `
    <div class="popupBody">
        <div class="newPlaylist">
            <div class="inputField">
                <input type="text" placeholder="Create new playlist" />
                <div class="createNew material-icons">create_new_folder</div>
            </div>
        </div>
        <ul class="defaultList"></ul>
    </div>`;

{/* <li data-list-name="abc">
    <span class="musicIcon material-icons" data-list-name="abc">queue_music</span>
    <span class="albumName" data-list-name="abc">Folder name</span>
</li> */}

// new PopupJs({
//     id: 'playlistPopup',
//     headingTxt: 'Add to palylist1',
//     body: popupBody,
// });