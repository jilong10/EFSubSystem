// Application Setup
const express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	firebase = require('firebase'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session');

// Routes Setup
const indexRoute = require('./routes/index'),
	accountAPIRoute = require('./routes/account-api'),
	statusUpdateAPIRoute = require('./routes/statusupdate-api'),
	orderGeneratorAPIRoute = require('./routes/ordergenerator-api');

// Express Setup
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: 'WihOSgoiwi904Hwlero38f',
	resave: false,
	saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// Routes
app.use('/', indexRoute);
app.use('/api/account', accountAPIRoute);					// For Register and Login
app.use('/api/statusupdate', statusUpdateAPIRoute);			// For Status Update of Crisis
app.use('/api/ordergenerator', orderGeneratorAPIRoute);		// For Deployment unit and Unit

// Sever Listening
app.listen(port, () => console.log('App is running on port ' + port));