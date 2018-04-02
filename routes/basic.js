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
const deploymentunitUrl = url + '/api/statusupdate/deploymentunit';
const unitUrl = url + '/api/statusupdate/unit';
const crisisUrl = url + '/api/statusupdate/crisis';
const statusUrl = url + '/api/status';

// Homepage
router.get('/', middleware.isLoggedIn, (req, res) => {	
	axios.get(statusUrl)
		.then(response => {										
			const crisisArr = Object.keys(response.data.Crisis).map(key => {
				response.data.Crisis[key].id = key;
				const enemyArr = Object.keys(response.data.Crisis[key].Enemy).map(enemyKey => response.data.Crisis[key].Enemy[enemyKey]);				
				response.data.Crisis[key].Enemy = enemyArr;
				return response.data.Crisis[key];
			});

			const deploymentunitArr = Object.keys(response.data.DeploymentUnit).map(key => response.data.DeploymentUnit[key]);	
			deploymentunitArr.sort((a, b) => {
				if (a.unitType < b.unitType) return -1;
				if (a.unitType > b.unitType) return 1;
				return 0;
			});	

			const statusArr = {
				'Crisis': crisisArr,
				'DeploymentUnit': deploymentunitArr,
				'DeploymentUnitStatus': response.data.DeploymentUnitStatus
			};
			res.render('index', { message: '', user: req.session.user, data: statusArr });
		})
		.catch(err => {
			res.render('index', { message: '', user: req.session.user, data: [] });	
		});	
});

// Register Page
router.route('/register')
	.get(middleware.isNotLoggedIn, (req, res) => res.render('register', { message: '' }))
	.post((req, res) => {
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
			})
			.catch(err => {
				res.render('deploymentplan', { message: 'Error occurs. Please try again.', user: req.session.user, data: [] });
			});	
	});

// Crisis
router.route('/crisis')
	.get(middleware.isLoggedIn, (req, res) => {
		axios.get(crisisUrl)
			.then(response => {							
				const crisisArr = Object.keys(response.data).map(key => {
					response.data[key].id = key;
					const enemyArr = Object.keys(response.data[key].Enemy).map(enemyKey => response.data[key].Enemy[enemyKey]);
					response.data[key].Enemy = enemyArr;
					return response.data[key];
				});	
				res.render('crisis', { message: '', user: req.session.user, data: crisisArr.reverse() });
			})
			.catch(err => {
				res.render('crisis', { message: 'Error occurs. Please try again.', user: req.session.user, data: [] });
			});	
	});

// Deployment Unit
router.route('/deploymentunit')
	.get(middleware.isLoggedIn, (req, res) => {
		axios.get(deploymentunitUrl)
			.then(response => {
				const deploymentunitArr = Object.keys(response.data.deploymentunit).map(key => response.data.deploymentunit[key]);	
				deploymentunitArr.sort((a, b) => {
					if (a.unitType < b.unitType) return -1;
					if (a.unitType > b.unitType) return 1;
					return 0;
				});

				const obj = {
					'status': response.data.status,
					'deploymentunit': deploymentunitArr
				}
				
				res.render('deploymentunit', { message: '', user: req.session.user, data: obj });
			})
			.catch(err => {
				res.render('deploymentunit', { message: 'Error occurs. Please try again.', user: req.session.user, data: [] });
			});	
	});

// EF Unit
router.route('/unit')
	.get(middleware.isLoggedIn, (req, res) => {
		axios.get(unitUrl)
			.then(response => {							
				const unitArr = Object.keys(response.data).map(key => response.data[key]);	
				unitArr.sort((a, b) => {
					if (a.unitType < b.unitType) return -1;
					if (a.unitType > b.unitType) return 1;
					return 0;
				});					
				res.render('unit', { message: '', user: req.session.user, data: unitArr });
			})
			.catch(err => {
				res.render('unit', { message: 'Error occurs. Please try again.', user: req.session.user, data: [] });
			});	
	});

module.exports = router;