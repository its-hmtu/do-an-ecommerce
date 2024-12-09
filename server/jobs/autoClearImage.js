const schedule = require("node-schedule");
const { Upload } = require("../models");
// runs every day at 00:00
const TIME = "0 0 0 * * *";
const autoClearImage = () => {
  schedule.scheduleJob(TIME, async () => {
    try {
      const uploads = await Upload.findAll({
        where: {
          product_id: null,
          user_id: null,
          option_id: null,
          category_id: null,
        },
      });

      if (uploads.length === 0) {
        console.log("No images to clear");
        return;
      }

      uploads.forEach(async (upload) => {
        await upload.destroy();
      });


      console.log("Images cleared");
    } catch (e) {
      console.log(e);
    }
  });
}

module.exports = autoClearImage;