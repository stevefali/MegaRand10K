// @ts-check

import { test, expect } from "@playwright/test";

const notificationApi = require("notificationapi-node-server-sdk").default;

require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

test.beforeEach(async ({ page }) => {
  await page.goto(
    "https://www.curseforge.com/minecraft/mc-mods/mega-randomizer"
  );
});

test("findDownloads", async ({ page }) => {
  const downloads = await page.locator(".detail-downloads");

  const downloadsQuantity = await downloads.innerText();

  if (Number(getDownloadsAsNumber(downloadsQuantity)) >= 10000) {
    // @ts-ignore
    notificationApi.init(clientId, clientSecret);
    notificationApi.send({
      notificationId: "10k_downloads",
      user: {
        id: "stevefaliszewski@gmail.com",
        email: "stevefaliszewski@gmail.com",
      },
    });
    console.log("YAAAAAAAYYYYY!!!!!!");
  }

  await expect(downloads).toBeVisible();
});

function getDownloadsAsNumber(downloadsString) {
  let asNum = "";
  for (let i = 0; i < downloadsString.length; i++) {
    if (!isNaN(downloadsString[i])) {
      asNum += downloadsString[i];
    }
  }
  return asNum;
}
