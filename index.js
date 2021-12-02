import { readFile as _readFile, writeFile as _writeFile } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import bluebirdPkg from 'bluebird';
const { promisify, all } = bluebirdPkg;

import * as myFiles from './src/shared/split-file-names.js';
import * as myFilesCount from './src/shared/split-file-count.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const splitFileFolder = 'src/split-files/'

const tvKeys = Object.keys(myFiles)

for (const key of tvKeys) {
  console.log(key, myFilesCount[key])
}


let promiseArray = [];
let splitFileCount = 1; // split files count
let splitFileName = myFiles.KIDS_TV ; // input file name india-tv

const splitFileUrl = `${splitFileFolder+splitFileName}/${splitFileName}`;
const destUrl = path.join(__dirname, `dest/${splitFileName}.m3u`);

const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);


const onAppendingIpTvLists = function(fileCount = 1, fileUrl) {
  promiseArray = Array.from(Array(fileCount), (_, i) => readFile(path.join(__dirname, `${fileUrl}${i+1}.m3u`)));
  // console.log(promiseArray);
}

onAppendingIpTvLists(splitFileCount, splitFileUrl);

all(promiseArray).then((dataArray)=>{
  let data = '';
  for(let i=0; i < dataArray.length; i++){
      data += dataArray[i];
  }
  return writeFile(destUrl, data);
});