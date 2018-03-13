const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const accountHelper = require('../helpers/account-helper');
const axios = require('axios');
const url = require('../config/url').serverurl;

// API URL
const registerURL = url + '/api/account/register';
const loginURL = url + '/api/account/login';

// Homepage
router.get('/', middleware.isLoggedIn, (req, res) => res.render('index', { message: '' }));

// Register Page
router.route('/register')
	.get(middleware.isNotLoggedIn, (req, res) => res.render('register', { message: '' }))
	.post((req, res) => {
		console.log(req.body);
		axios.post(registerURL, {
			name: req.body.name,
			username: req.body.username,
			password: req.body.password,
			v_password: req.body.v_password
		})
		.then(response => {			
			if (response.data.success) {	
				res.render('login', { message: response.data.message });
			} else {
				res.render('register', { message: response.data.message });
			}
		});
	});

// Login Page
router.route('/login')
	.get(middleware.isNotLoggedIn, (req, res) => res.render('login', { message: '' }))
	.post((req, res) => {
		axios.post(loginURL, {
			username: req.body.username,
			password: req.body.password
		})
		.then(response => {			
			if (response.data.success) {
				req.session.user = req.body.username;		
				res.redirect('/');
			} else {
				res.render('login', { message: response.data.message });
			}
		});
	});

// Logout
router.get('/logout', middleware.isLoggedIn, (req, res) => {
	req.session.destroy();
	res.redirect('/login');
});

module.exports = router;