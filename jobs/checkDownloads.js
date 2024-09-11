const shell = require("shelljs");

console.log("Checking..");

shell.exec("npx playwright test");
