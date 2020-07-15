const fs = require("fs-extra");

(async () => {
  try {
    await fs.mkdirp("cron/");
  } catch (error) {
    console.log("error");
  }
})();
