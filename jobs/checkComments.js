const { chromium } = require("playwright");

console.log("Checking comments...");

async function checkCommentsWithPlaywright() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(
      "https://www.curseforge.com/minecraft/mc-mods/mega-randomizer"
    );

    const commentsPagePath = "/minecraft/mc-mods/mega-randomizer/comments";
    const comments = page.locator(`a[href="${commentsPagePath}"]`);

    const delay = (millis) =>
      new Promise((resolve) => setTimeout(resolve, millis));

    if (comments) {
      const text = await comments.innerText();

      const reg = /\((\d+)\)/;
      const commentsNumber = text.match(reg);
      if (commentsNumber[1]) {
        console.log("Comments: ", commentsNumber[1]);
      }
    } else {
      console.log("Error finding comments");
    }

    const filesLink = page.locator(`a`, { hasText: "Files" });

    if (filesLink) {
      await filesLink.click();
      await delay(3000);
    }
  } catch (error) {
    if (error) {
      console.log("Encountered an error checking comments:");
      console.log(error);
    }
  }

  context.close();
  browser.close();
}

(async () => {
  await checkCommentsWithPlaywright();
})();
