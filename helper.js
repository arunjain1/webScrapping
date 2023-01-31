const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const xlsx = require("xlsx");

function dirCreator(input) {
  if (fs.existsSync(input) == false) {
    fs.mkdirSync(input);
  }
}

function filehander(inputpath, dataObj) {
  let arr = [];
  if (fs.existsSync(inputpath) == false) {
    arr.push(dataObj);
    fs.writeFileSync(inputpath, JSON.stringify(arr));
  } else {
    let presentData = fs.readFileSync(inputpath);
    let arr = JSON.parse(presentData);
    arr.push(dataObj);
    fs.writeFileSync(inputpath, JSON.stringify(arr));
  }
}

function rootCreator(inputPath) {
  if (fs.existsSync(inputPath) == true) {
    rimraf.sync(inputPath);
  }
  fs.mkdirSync(inputPath);
}

// Excel Read and Write
function excelReader(inputPath) {
  let workbook = xlsx.readFile(inputPath);
  let worksheet = workbook.Sheets["Player Detail"];

  let data = xlsx.utils.sheet_to_json(worksheet);
  return data;
}

function excelWriter(inputPath, json) {
  let workbook = xlsx.utils.book_new();
  let worksheet = xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Player Detail");
  xlsx.writeFile(workbook, inputPath);
}

function excelHandler(dataObj, inputPath) {
  let arr = [];
  if (fs.existsSync(inputPath) == false) {
    arr.push(dataObj);
    excelWriter(inputPath, arr);
  } else {
    arr = excelReader(inputPath);
    arr.push(dataObj);
    excelWriter(inputPath, arr);
  }
}

module.exports = {
  dirCreator: dirCreator,
  filehander: filehander,
  rootCreator: rootCreator,
  excelHandler: excelHandler,
};
