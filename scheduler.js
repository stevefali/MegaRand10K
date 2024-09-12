const Bree = require("bree");
const path = require("path");

const appDir = path.resolve(__dirname);

const schedule = [
  {
    name: "checkDownloads",
    path: path.join(appDir + "/jobs", "checkDownloads.js"),
    cron: "*/5 * * * *",
  },
];

const bree = new Bree({
  root: false,
  jobs: schedule,
  errorHandler: (error) => {
    console.log(error);
  },
});

const startBree = async () => {
  console.log("Bree starting");
  await bree.start();
  console.log("Bree running");
};

module.exports = {
  startBree,
};
