const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { v4: uuid } = require('uuid');
const AdminRouter = require('./routes/admin');

app.use(express.json()); // Để parse JSON request body
app.use('/api', AdminRouter);



app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});