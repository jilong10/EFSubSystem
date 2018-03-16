const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const deploymentPlanHelper = require('../helpers').DeploymentPlanHelper;
const axios = require('axios');
const url = require('../config').Url.serverurl;

// API URL
const registerURL = url + '/api/account/register';
const loginURL = url + '/api/account/login';
const deploymentplanUrl = url + '/api/ef';

// Homepage
router.get('/', middleware.isLoggedIn, (req, res) => {
	res.render('index', { message: '', user: req.session.user })
});

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
				deploymentPlanHelper.liveCheckDeploymentPlan(true);
				res.redirect('/');
			} else {
				res.render('login', { message: response.data.message });
			}
		});
	});

// Logout
router.get('/logout', middleware.isLoggedIn, (req, res) => {
	req.session.destroy();
	deploymentPlanHelper.liveCheckDeploymentPlan(false);
	res.redirect('/login');
});

// Deployment Plan
router.route('/deploymentplan')
	.get(middleware.isLoggedIn, (req, res) => {	
		axios.get(deploymentplanUrl)
			.then(response => {							
				const deploymentPlanArr = Object.keys(response.data).map(key => {
					response.data[key].id = key;
					const enemyArr = Object.keys(response.data[key].Enemy).map(enemyKey => response.data[key].Enemy[enemyKey]);
					response.data[key].Enemy = enemyArr;
					return response.data[key];
				});						
				res.render('deploymentplan', { message: '', user: req.session.user, data: deploymentPlanArr.reverse() });
			});			
	});

// Crisis
router.route('/crisis')
	.get(middleware.isLoggedIn, (req, res) => res.render('crisis', { message: '', user: req.session.user }));

// Deployment Unit
router.route('/deploymentunit')
	.get(middleware.isLoggedIn, (req, res) => res.render('deploymentunit', { message: '', user: req.session.user }));

// EF Unit
router.route('/unit')
	.get(middleware.isLoggedIn, (req, res) => res.render('unit', { message: '', user: req.session.user }));

module.exports = router;