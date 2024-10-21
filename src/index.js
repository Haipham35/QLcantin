const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'black myth: wukong';

const app = express();
const port = 3000;

const AdminRouter = require('./routes/admin');
const router = require('./routes');
const session = require('express-session');

app.use(express.json()); // Để parse JSON request body

app.use(cors());
app.use(bodyParser.json());


// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {}
// // }))
// app.use(async function (req, res, next) {
//     if (req.session.isAuthenticated === null) {
//         req.session.isAuthenticated = false
//     }
//     res.locals.IsAuthenticated = req.session.isAuthenticated
//     res.locals.AuthUser = req.session.authUser
//     next()
// })



router(app);



app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});