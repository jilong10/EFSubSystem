// Application Setup
const express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session')
	http = require('http').Server(app),
	io = require('socket.io')(http);

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

let users = [];

// io.sockets.on('connect', client => {
//     clients.push(client); 

//     client.on('disconnect', () => clients.splice(clients.indexOf(client), 1));
// });

io.on('connection', socket => {		
	socket.on('disconnect', () => {
		io.emit('reinitialize user', true);		
	});

	socket.on('user', user => {
		if (users.indexOf(user) === -1) {
			users.push(user);
		}		
		io.emit('get users', users);
	});

	socket.on('reinitialize user', user => {
		users = [];
		users.push(user);
		io.emit('get users', users);
	});

	socket.on('coordinate changed', msg => {
		socket.broadcast.emit('coordinate changed', msg);
	});

	socket.on('lock enemy marker', msg => {
		socket.broadcast.emit('lock enemy marker', msg);
	});

	socket.on('release enemy marker', msg => {
		socket.broadcast.emit('release enemy marker', msg);
	});

	socket.on('lock troop marker', msg => {
		socket.broadcast.emit('lock troop marker', msg);
	});

	socket.on('release troop marker', msg => {
		socket.broadcast.emit('release troop marker', msg);
	});
});

// Sever Listening
http.listen(port, () => console.log('App is running on port ' + port));