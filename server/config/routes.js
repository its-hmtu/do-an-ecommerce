var indexRouter = require("../routes/index");
const userRoutes = require("../routes/user.route");
const tagCategoryRoutes = require("../routes/tag_category.route");

module.exports = (app) => {
  app.use("/", indexRouter);
  // !-- Do not remove this line --! //
  app.use("/api/account", userRoutes);
  app.use("/api", tagCategoryRoutes);
};
