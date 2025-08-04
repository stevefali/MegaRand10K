const { execSync } = require("child_process");
const axios = require("axios");

const notificationApi = require("notificationapi-node-server-sdk").default;
const fs = require("fs");

require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const curseForgeKey = process.env.CURSEFORGE_API_KEY;

console.log("Checking..");

async function checkDownloadsWithApi() {
  const parameters = JSON.parse(fs.readFileSync("./parameters.json", "utf-8"));

  const threshold = parameters.threshold;
  const downloadsInterval = parameters.interval;

  const curseForgeResponse = await getCurseForgeResponse();
  const downloadCount = curseForgeResponse.downloadCount;

  if (downloadCount >= threshold) {
    notificationApi.init(clientId, clientSecret);
    await notificationApi.send({
      notificationId: "10k_downloads",
      user: {
        id: "stevefaliszewski@gmail.com",
        email: "stevefaliszewski@gmail.com",
      },
      mergeTags: {
        threshold: threshold,
        downloads: getDownloadsAsNumber(downloadsQuantity),
      },
    });
    console.log("YAAAAAAAYYYYY!!!!!!");

    const nextParameters = JSON.stringify({
      threshold: threshold + downloadsInterval,
      interval: downloadsInterval,
    });
    fs.writeFileSync("./parameters.json", nextParameters);

    const message = `Update parameters.json, setting new threshold to ${
      threshold + downloadsInterval
    }.`;

    gitCommitAndPush(message);
  }
}

(async () => {
  await checkDownloadsWithApi();
})();

async function getCurseForgeResponse() {
  const response = await axios.get(
    "https://api.curseforge.com/v1/mods/906419",
    {
      headers: {
        "x-api-key": curseForgeKey,
      },
    }
  );
  return response.data.data;
}

function gitCommitAndPush(message) {
  execSync("git add parameters.json");
  execSync(`git commit -m "${message}"`);
  execSync("git push");
}
