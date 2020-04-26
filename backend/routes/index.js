const postRouter = require('./posts/posts.router');
const userRouter = require('./users/users.router');
const uploadRouter = require('./uploads/uploads.router');

module.exports = app => {
    app.use('/api/users', userRouter);
    app.use('/api/posts', postRouter);
    app.use('/api/uploads', uploadRouter);
}



