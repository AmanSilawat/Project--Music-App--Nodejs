class MusicNode {
    constructor(name, type = 'RootNode') {
        switch (type) {
            case 'RootNode':
                this.name = name;
                this.type = type;
                this.children = [];
                break;

            case 'folder':
                this.name = name;
                this.type = type;
                this.children = [];
                break;

            case 'track':
                this.type = type;
                this.tracks = [];
                break;

            default:
                console.log('err');
                break;
        }
    }
}

module.exports = MusicNode;