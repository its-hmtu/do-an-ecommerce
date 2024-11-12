var indexRouter = require("../routes/index");
const userRoutes = require("../routes/user.route");
const categoryRoutes = require("../routes/category.route");
const productRoutes = require("../routes/product.route");
const adminRoutes = require("../routes/admin.route");
const uploadRoutes = require("../routes/upload.route");
const brandRoutes = require("../routes/brand.route");
const orderRoutes = require("../routes/order.route");
const saleRoutes = require('../routes/sale.route');
const BASE_URL = "/api";

module.exports = (app) => {
  app.use("/", indexRouter);
  // !-- Do not remove this line --! //
  app.use(`${BASE_URL}/account`, userRoutes);
  app.use(`${BASE_URL}/categories`, categoryRoutes);
  app.use(`${BASE_URL}/products`, productRoutes);
  app.use(`${BASE_URL}/admin`, adminRoutes);
  app.use(`${BASE_URL}/upload`, uploadRoutes);
  app.use(`${BASE_URL}/brands`, brandRoutes);
  app.use(`${BASE_URL}/orders`, orderRoutes);
  app.use(`${BASE_URL}/sale`, saleRoutes);
};
