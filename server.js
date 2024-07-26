const express = require('express');
const bodyParser = require('body-parser');
const reviewsRouter = require('./routes/reviews');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/', reviewsRouter);

app.listen(3000, () => console.log('Server started on port 3000'));
