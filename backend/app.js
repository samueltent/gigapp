const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const app = express();

dotenv.config();

const authRoute = require('./routes/auth');
const jobRoute = require('./routes/job');
const userRoute = require('./routes/user');

//db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useFindAndModify: false }, () => {
	console.log('connected to db!');
});


//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header('Content-Type', 'application/json');
	next();
  });

//route middlewares
app.use(authRoute);
app.use(jobRoute);
app.use(userRoute);

app.listen(process.env.PORT, () => {
	console.log('server on');
});