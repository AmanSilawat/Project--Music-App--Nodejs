const util = require('util'); // run linux commend with async...
const exec = util.promisify(require('child_process').exec); // run linux commend with async...
const MusicNode = require('./MusicNode.js');

const utils = {
    async getDirData() {
        // get list of songs using shell command
        const { stdout } = await exec(
            "find ./public/assets/data -iname '*.mp3' -print"
        );

        // get usefull data on songs list
        const songListStr = JSON.stringify(stdout).replace(
            /(\.\/public\/assets\/data\/)|(\\n")|(")/gi,
            ''
        );
        const pathList = songListStr.split('\\n');
        const pathListArr = pathList.map((path) => path.split('/'));

        const treeData = {};
        treeData['RootNode'] = new MusicNode('RootNode', 'RootNode');

        function recursion(data, MusicNode, treeData, previousNode = 'RootNode') {
            if (data.length == 0) {
                return treeData['RootNode'];
            }

            const lastRow = data.pop();
            const firstVal = lastRow.shift();

            // if not a music type
            if (firstVal.match(/\.mp3/) == null) {
                try {
                    // already defing then skip this try code block
                    treeData[firstVal].name == undefined;
                } catch (e) {
                    treeData[firstVal] = new MusicNode(firstVal, 'folder');
                    treeData[previousNode].children.push(treeData[firstVal]);
                }

                // reassign
                previousNode = firstVal;
                data.push(lastRow);
            } else {
                try {
                    treeData[previousNode].children[0].tracks.push(firstVal);
                } catch (error) {
                    treeData[firstVal] = new MusicNode(firstVal, 'track');
                    treeData[previousNode].children.push(treeData[firstVal]);
                    treeData[firstVal].tracks.push(firstVal);
                }

                previousNode = 'RootNode';
            }

            return recursion(data, MusicNode, treeData, previousNode);
        }

        const ressult = recursion(pathListArr, MusicNode, treeData);
        return ressult;
    },

    getUnknow(musicDir, dataset) {
        let url = dataset.split('/').map((el) => el.replace(/ /g, '-'));
        console.log(dataset);
        console.log(url);
        let musicTree = musicDir;

        let i = 0;
        let popedVal = url.shift();
        while (musicTree.length > i) {
            let trimed = musicTree[i].name.replace(/ /g, '-');

            if (trimed == popedVal) {
                if (url.length == 0) {
                    musicTree = musicTree[i];
                    break;
                }
                musicTree = musicTree[i].children;
                popedVal = url.shift() || false;
                i = 0;
                continue;
            }
            i++;
        }
    }
}

module.exports = utils;
