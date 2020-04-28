const express = require('express');
const mountRoutes = require('./routes');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');


const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    })
);

app.use(express.static('public'));

app.use(session({
    secret: 'keyboard cat',
}));

app.use(bodyParser.json());

// router
mountRoutes(app);

//start server
app.listen(3001, (err) => {
    if (err) {
        throw err;
    }
    console.log('Server listen on port 3001');
});











