const postRouter = require('./posts/posts.router');
const userRouter = require('./users/users.router');
const uploadRouter = require('./uploads/uploads.router');
const statRouter = require('./statistics/statistics.router')

module.exports = app => {
    app.use('/api/users', userRouter);
    app.use('/api/posts', postRouter);
    app.use('/api/uploads', uploadRouter);
    app.use('/api/stats', statRouter);
}