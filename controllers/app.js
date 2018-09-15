const express = require('express');
const bodyParser = require('body-parser');
const createActivity = require('./controllers/createActivity');

const app = express();

app.use(bodyParser.json());

app.post('/profile/activities', createActivity);


app.listen(3000, () => console.log('Example app listening on port 3000!'));
