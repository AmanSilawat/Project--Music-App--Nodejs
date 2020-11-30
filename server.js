const express = require('express');
const util = require('util'); // run linux commend with async...
const exec = util.promisify(require('child_process').exec); // run linux commend with async...
const MusicNode = require('./MusicNode.js');

const app = express();

// set the view engine to ejs and public folder
app.set('view engine', 'ejs');
app.use(express.static('./public'));

async function getDirData() {
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
}

app.get('/', function setRootDir(req, res) {
    res.render('index');
});

app.get('/getData', function getDa(req, res) {
    getDirData(res).then((response) => res.send(response.children));
});

app.listen(8080);
