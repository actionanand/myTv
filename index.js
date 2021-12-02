import { readFile as _readFile, writeFile as _writeFile } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import bluebirdPkg from 'bluebird';
const { promisify, all } = bluebirdPkg;

import * as myFiles from './src/shared/split-file-names.js';
import * as myFilesCount from './src/shared/split-file-count.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);

const splitFileFolder = 'src/split-files/';

const tvKeys = Object.keys(myFiles); // pulling out all keys

const onAppendingIpTvLists = function(fileCount = 1, fileUrl, destUrl) {
  let promiseArray = [];
  promiseArray = Array.from(Array(fileCount), (_, i) => readFile(path.join(__dirname, `${fileUrl}${i+1}.m3u`))); // like ['file1', 'file2']
  // console.log(promiseArray);
  all(promiseArray).then((dataArray)=>{
    let data = '';
    for(let i=0; i < dataArray.length; i++){
        data += dataArray[i];
    }
    return writeFile(destUrl, data);
  });
}

for (const key of tvKeys) {
  // console.log(key, myFilesCount[key])
  let splitFileCount = myFilesCount[key]; // split files count
  let splitFileName = myFiles[key]; // input file name india-tv i.e myFiles.KIDS_TV 
  let splitFileUrl = `${splitFileFolder+splitFileName}/${splitFileName}`;
  let destUrl = path.join(__dirname, `dest/${splitFileName}.m3u`);
  onAppendingIpTvLists(splitFileCount, splitFileUrl, destUrl);
}
