const moment = require('moment-timezone').tz("Asia/Singapore");
const notifier = require('node-notifier');
const Crisis = require('../models').Crisis;
const Enemy = require('../models').Enemy;
const Firebase = require('../config').Firebase;
const deploymentPlanRef = Firebase.database().ref('DeploymentPlan');

exports.readDeploymentPlan = (req, res) => {
	deploymentPlanRef.once('value', snapshot => {
		return res.json(snapshot);
	});
};

exports.createDeploymentPlan = (req, res) => {	
	const deploymentPlan = req.body;	
	const date = moment().format('DD/MM/YYYY');
	const time = moment().format('HH:mm:ss');
	deploymentPlan['date'] = date;
	deploymentPlan['time'] = time;

	var planId = deploymentPlanRef.push().key;	
	
	deploymentPlanRef.child(planId)
		.set(deploymentPlan)
		.then(() => res.json({
			success: true,
			message: 'Deployment Plan Added Successfully',
			plan_id: planId
		}))
		.catch(err => res.json({
			success: false,
			message: 'Deployment Plan Added Failed'
		}));
};

exports.deleteDeploymentPlan = (req, res) => {
	const planId = req.params.plan_id;

	deploymentPlanRef.child(planId)
		.once('value', snapshot => {
			if (snapshot.exists()) {
				deploymentPlanRef.child(planId)
					.remove()
					.then(() => res.json({
						success: true,
						message: 'Deployment Plan Deleted Successfully'
					}))
					.catch(err => res.json({
						success: false,
						message: 'Deployment Plan Deleted Failed'
					}));
			} else {
				return res.json({
					success: false,
					message: 'Invalid deployment plan id'
				});	
			}
		});
};

exports.liveCheckDeploymentPlan = (turnOn) => {
	if (turnOn) {
		deploymentPlanRef.on('child_added', snapshot => {
			notifier.notify({
				  title: 'EF Notification',
				  message: 'New deployment plan arrive',				  
				});
		});
	} else {
		deploymentPlanRef.off('child_added');
	}
};