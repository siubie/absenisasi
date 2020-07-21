const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const puppeteer = require("puppeteer");
const moment = require("moment");
const fs = require("fs-extra");
const delay = require("delay");
(async () => {
  try {
    const time =
      Math.random() * (process.env.MAX - process.env.MIN) + process.env.MIN;
    await delay(
      Math.random() * (process.env.MAX - process.env.MIN) + process.env.MIN
    );
    const browser = await puppeteer.launch({
      headless: process.env.HEADLESS === "true" || false,
      defaultViewport: null,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("https://portal.polinema.ac.id", {
      waitUntil: "networkidle2",
    });
    await page.type("#username", process.env.USERNAME);
    await page.waitFor(3000);
    await page.type("#password", process.env.PASSWORD);
    await page.waitFor(3000);
    await page.click(".submit");
    await page.waitForNavigation();
    await page.click("a[href$='#tab_presensi']");
    await page.waitFor(3000);
    const [button] = await page.$x("//button[contains(., ' Presensi Online')]");
    await page.waitFor(3000);
    if (button) {
      await button.click({
        waitUntil: "networkidle2",
      });
    }
    await page.waitForSelector("#table_data-fp_online");
    const [buttonAbsen] = await page.$x("//button[contains(., 'KLIK UNTUK')]");
    if (buttonAbsen) {
      await buttonAbsen.click({
        waitUntil: "networkidle2",
      });
    }
    const date = new Date();
    const formattedDate = moment(date).format("YYYYMMDD");
    await page.waitFor(3000);
    await fs.mkdirp("logs/");
    await page.screenshot({ path: "logs/" + formattedDate + ".png" });
    await browser.close();
  } catch (error) {
    const browser = await puppeteer.launch({
      headless: process.env.HEADLESS === "true" || false,
      defaultViewport: null,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("https://portal.polinema.ac.id", {
      waitUntil: "networkidle2",
    });
    await fs.mkdirp("logs/");
    await page.screenshot({ path: "logs/" + formattedDate + "-error.png" });
    await browser.close();
    process.exit(1);
  }
})();
