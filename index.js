// Application Setup
const express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session');

// Routes Setup
const indexRoute = require('./routes');

// Express Setup
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: process.env.SECRET || 'WihOSgoiwi904Hwlero38f',
	resave: false,
	saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// Routes
app.use('/', indexRoute.BasicRoute);									// For Website
app.use('/api/account', indexRoute.AccountApiRoute);					// For Register and Login
app.use('/api/statusupdate', indexRoute.StatusUpdateApiRoute);			// For Status Update of Crisis
app.use('/api/ordergenerator', indexRoute.OrderGeneratorApiRoute);		// For Deployment unit and Unit
app.use('/api/ef', indexRoute.EFApiRoute); 								// For Deployment plan
app.use('/api/mycmo', indexRoute.MyCmoApiRoute);						// For Send Status Update to CMOAPI

// Sever Listening
app.listen(port, () => console.log('App is running on port ' + port));