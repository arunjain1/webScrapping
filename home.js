const jsdom = require("jsdom");
const fs = require("fs");
const path = require("path");
const request = require("request");
const scoreCardobj = require("./scorcard");
const helper = require("./helper");
const { stat } = require("fs/promises");
const input = process.argv;
let url = input.slice(2);
url = url.toString();
const baseurl = url.split("com")[0] + "com";
let arr = url.split("/");
let folderName = arr[4];
folderName = folderName.split("-");
folderName.pop();
folderName = folderName.join(" ");
helper.rootCreator(path.join(__dirname, folderName));
request(url, cb);

function cb(error, response, body) {
  if (error) {
    console.log("Error Found  : ", error.message);
  } else if (response && response.status == 404) {
    console.log("Page not found");
  } else {
    console.log("content received");
    extractLinks(body);
  }
}
function extractLinks(html) {
  let JSDOM = jsdom.JSDOM;
  let dom = new JSDOM(html);
  let alltab = dom.window.document.querySelectorAll(
    ".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent"
  );

  for (let i = 0; i < alltab.length; i++) {
    let matchlink = alltab[i].querySelector("a").getAttribute("href");
    matchlink = baseurl + matchlink;
    let status = alltab[i]
      .querySelector(".ds-text-tight-xs.ds-font-bold.ds-uppercase.ds-leading-5")
      .textContent.trim();
    if (status == "RESULT") {
      scoreCardobj.scoreCardfn(matchlink, folderName);
    }
  }
}
