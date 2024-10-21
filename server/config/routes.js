var indexRouter = require("../routes/index");
const userRoutes = require("../routes/user.route");
const categoryRoutes = require("../routes/category.route");
const productRoutes = require("../routes/product.route");
const adminRoutes = require("../routes/admin.route");
const uploadRoutes = require("../routes/upload.route");
const brandRoutes = require("../routes/brand.route");

module.exports = (app) => {
  app.use("/", indexRouter);
  // !-- Do not remove this line --! //
  app.use("/api/account", userRoutes);
  app.use("/api", categoryRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/brands", brandRoutes);
};
