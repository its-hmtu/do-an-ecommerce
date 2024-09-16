// var indexRouter = require('../routes/index');
// const userRouter = require('../routes/user.route');
// const authRouter = require('../routes/auth.route');

import indexRouter from '../routes/index.js';
import userRouter from '../routes/user.route.js';
import authRouter from '../routes/auth.route.js';

const routesConfig = (app) => {
    app.use('/', indexRouter);
    // !-- Do not remove this line --! //
    app.use('/users', userRouter);

    app.use('/account', authRouter);
};

export default routesConfig;