const bodyParser = require('body-parser');
const postRouter = require('./users/posts.router');
const userRouter = require('./users/users.router');
const uploadRouter = require('./uploads/uploads.router');

module.exports = app => {
    app.use(bodyParser.json());
    app.use('/users', userRouter);
    app.use('/posts', postRouter);
    app.use('/upload', uploadRouter);
    app.get('/', (req, res) => res.render('./index'));
}


