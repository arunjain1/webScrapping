const jsdom = require("jsdom");
const fs = require("fs");
const path = require("path");
const helper = require("./helper");
const request = require("request");
const { table } = require("console");
function scoreCardfn(url, folderName) {
  request(url, cb.bind(null, folderName));
}
function cb(folderName, error, response, body) {
  if (error) {
    console.log("Error Found");
  } else if (response && response.status == 404) {
    console.log("Page Not Found");
  } else {
    Parser(body, folderName);
  }
}
function Parser(body, folderName) {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(body);
  let teamName = dom.window.document.querySelectorAll(
    ".ds-flex.ds-px-4.ds-border-b.ds-border-line.ds-py-3.ds-bg-ui-fill-translucent-hover"
  );
  let team1 = teamName[0]
    .querySelector(".ds-text-title-xs.ds-font-bold.ds-capitalize")
    .textContent.trim();
  let team2 = teamName[1]
    .querySelector(".ds-text-title-xs.ds-font-bold.ds-capitalize")
    .textContent.trim();
  let result = dom.window.document
    .querySelector(
      ".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo span"
    )
    .textContent.trim();
  let bigTable = dom.window.document.querySelectorAll(".ds-rounded-lg.ds-mt-2");
  for (let i = 0; i < bigTable.length; i++) {
    let tName = bigTable[i]
      .querySelector(".ds-text-title-xs.ds-font-bold.ds-capitalize")
      .textContent.trim();
    let oppName = tName == team1 ? team2 : team1;
    let tables = bigTable[i].querySelectorAll(
      ".ds-w-full.ds-table.ds-table-md.ds-table-auto"
    );
    extractBattingdata(
      tables[0],
      tName,
      oppName,
      folderName,
      "Batting",
      result
    );
    extractBowlingdata(
      tables[1],
      oppName,
      tName,
      folderName,
      "Bowling",
      result
    );
  }
}
function extractBattingdata(table, team1, team2, folderName, mode, result) {
  let data = table.querySelectorAll('tbody tr[class=""]');
  for (let i = 0; i < data.length - 2; i++) {
    let playerdata = data[i].querySelectorAll(
      ".ds-w-0.ds-whitespace-nowrap.ds-min-w-max"
    );
    if (playerdata.length == 7) {
      let name = playerdata[0].querySelector("a").getAttribute("title");
      let runs = playerdata[1].querySelector("strong").textContent;
      let balls = playerdata[2].textContent;
      let fours = playerdata[4].textContent;
      let sixes = playerdata[5].textContent;
      let sr = playerdata[6].textContent;
      let teamName = team1;
      let Opponent = team2;
      let dataObj = {
        name,
        runs,
        balls,
        fours,
        sixes,
        sr,
        Opponent,
        result,
      };

      organizer(teamName, name, dataObj, folderName, mode);
    }
  }
}
function extractBowlingdata(table, team1, team2, folderName, mode, result) {
  let data = table.querySelectorAll('tbody tr[class=""]');

  for (let i = 0; i < data.length; i++) {
    let playerdata = data[i].querySelectorAll("td.ds-min-w-max");
    let wickets = data[i]
      .querySelector("td:not(.ds-min-w-max)")
      .querySelector("strong").textContent;
    let name = playerdata[0].querySelector(
      ".ds-text-tight-s.ds-font-medium.ds-text-typo.ds-underline.ds-decoration-ui-stroke"
    ).textContent;
    let over = playerdata[1].textContent;
    let maiden = playerdata[2].textContent;
    let runs = playerdata[3].textContent;
    let economy = playerdata[4].textContent;
    let zeroes = playerdata[5].textContent;
    let fours = playerdata[6].textContent;
    let sixes = playerdata[7].textContent;
    let wide = playerdata[8].textContent;
    let noBall = playerdata[9].textContent;
    let teamName = team1;
    let Opponent = team2;
    let dataObj = {
      name,
      over,
      maiden,
      runs,
      wickets,
      economy,
      zeroes,
      fours,
      sixes,
      wide,
      noBall,
      Opponent,
      result,
    };

    organizer(teamName, name, dataObj, folderName, mode);
  }
}
function organizer(teamName, playerName, dataObj, folderName, mode) {
  let teampath = path.join(__dirname, folderName, teamName);
  helper.dirCreator(teampath);
  teampath = path.join(teampath, mode);
  helper.dirCreator(teampath);
  let playerPath = path.join(teampath, playerName + ".xlsx");
  helper.excelHandler(dataObj, playerPath);
}

module.exports = {
  scoreCardfn: scoreCardfn,
};
