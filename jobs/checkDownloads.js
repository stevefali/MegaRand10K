const { chromium } = require("playwright");

const notificationApi = require("notificationapi-node-server-sdk").default;
const fs = require("fs");

require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

console.log("Checking..");

async function checkDownloadsWithPlaywright() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(
    "https://www.curseforge.com/minecraft/mc-mods/mega-randomizer"
  );

  const downloads = page.locator(".detail-downloads");

  const downloadsQuantity = await downloads.innerText();

  const parameters = JSON.parse(fs.readFileSync("./parameters.json", "utf-8"));

  const threshold = parameters.threshold;
  const downloadsInterval = parameters.interval;

  if (Number(getDownloadsAsNumber(downloadsQuantity)) >= threshold) {
    notificationApi.init(clientId, clientSecret);
    notificationApi.send({
      notificationId: "10k_downloads",
      user: {
        id: "stevefaliszewski@gmail.com",
        email: "stevefaliszewski@gmail.com",
      },
    });
    console.log("YAAAAAAAYYYYY!!!!!!");

    const nextParameters = JSON.stringify({
      threshold: threshold + downloadsInterval,
      interval: downloadsInterval,
    });
    fs.writeFileSync("./parameters.json", nextParameters);
  }

  await context.close();
  await browser.close();
}

(async () => {
  await checkDownloadsWithPlaywright();
})();

function getDownloadsAsNumber(downloadsString) {
  let asNum = "";
  for (let i = 0; i < downloadsString.length; i++) {
    if (!isNaN(downloadsString[i])) {
      asNum += downloadsString[i];
    }
  }
  return asNum;
}
