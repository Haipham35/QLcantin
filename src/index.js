const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { v4: uuid } = require('uuid');
const AdminRouter = require('./routes/admin');
const router = require('./routes');
app.use(express.json()); // Để parse JSON request body
router(app);



app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});