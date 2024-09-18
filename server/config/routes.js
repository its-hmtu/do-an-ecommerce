var indexRouter = require('../routes/index');

module.exports = (app) => {
    app.use('/', indexRouter);
    // !-- Do not remove this line --! //

    app.use('/users', require('../routes/user.route'));
};