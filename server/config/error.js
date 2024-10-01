var createError = require("http-errors");

module.exports = (app) => {
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    // res.status(err.status || 500);
    // res.render('error');
    let status = res.statusCode === 200 ? 500 : res.statusCode;
    // return the error message and stack trace
    if (process.env.MODE === "production") {
      delete err.stack;
    }
    return res.status(status).json({
      message:
        process.env.MODE === "production" ? "An error occurred" : err.message,
      success: false,
      stack: err.stack,
    });
  });
};
