var indexRouter = require("../routes/index");
const userRoutes = require("../routes/user.route");
module.exports = (app) => {
  app.use("/", indexRouter);
  // !-- Do not remove this line --! //
  app.use("/account", userRoutes);
};
