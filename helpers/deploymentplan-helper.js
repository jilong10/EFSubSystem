const moment = require('moment-timezone');
const Crisis = require('../models').Crisis;
const Enemy = require('../models').Enemy;
const Firebase = require('../config').Firebase;
const deploymentPlanRef = Firebase.database().ref('DeploymentPlan');
const deploymentPlanStatusRef = Firebase.database().ref('DeploymentPlanStatus');
const crisisRef = Firebase.database().ref('Crisis');

exports.readDeploymentPlan = (req, res) => {
	deploymentPlanRef.once('value', snapshot => {
		return res.json(snapshot);
	});
};

exports.createDeploymentPlan = (req, res) => {	
	const deploymentPlan = req.body;	
	const date = moment().tz("Asia/Singapore").format('DD/MM/YYYY');
	const time = moment().tz("Asia/Singapore").format('HH:mm:ss');
	deploymentPlan['date'] = date;
	deploymentPlan['time'] = time;

	var planId = deploymentPlanRef.push().key;	
	
	deploymentPlanRef.child(planId)
		.set(deploymentPlan)
		.then(() => {			
			deploymentPlanStatusRef.set({
				'status': true
			})
			.then(() => res.json({
				success: true,
				message: 'Deployment Plan Added Successfully',
				plan_id: planId
			}))
			.catch(err => res.json({
				success: false,
				message: 'Deployment Plan Added Failed'
			}));		
		})
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

exports.readDeploymentPlanStatus = (req, res) => {
	deploymentPlanStatusRef.once('value', snapshot => {
		res.json(snapshot);
	});
};

exports.editDeploymentPlanStatus = (req, res) => {
	const status = req.body.status;
	deploymentPlanStatusRef.update({
		"status": status
	})
	.then(() => res.json({
		success: true,
		message: 'Deployment Plan Status Updated Successfully'
	}))
	.catch(err => res.json({
		success: false,
		message: 'Deployment Plan Status Updated Failed'
	}))
};

exports.editCrisisByDeploymentPlan = async (req, res) => {
	const deploymentPlanId = req.params.plan_id;
	const deploymentPlanSnapshot = await deploymentPlanRef.child(deploymentPlanId).once('value');
	const deploymentPlanObj = deploymentPlanSnapshot.val();
	const date = moment().tz("Asia/Singapore").format('DD/MM/YYYY');
	const time = moment().tz("Asia/Singapore").format('HH:mm:ss');
	deploymentPlanObj['date'] = date;
	deploymentPlanObj['time'] = time;

	crisisRef.once('value', snapshot => {
		if (snapshot.exists()) {
			crisisRef
				.remove()
				.then(() => {					
					crisisRef.child(deploymentPlanId)
						.set(deploymentPlanObj)
						.then(() => res.json({
							success: true,
							message: 'Crisis Updated Successfully'
						}))
						.catch(err => res.json({
							success: false,
							message: 'Crisis Updated Failed'
						}));
				});
		} else {
			return res.json({
				success: false,
				message: 'Crisis Updated Failed'
			});
		}
	});
};

exports.checkCrisisExists = (req, res) => {
	crisisRef.once('value', snapshot => {
		if (snapshot.exists()) {
			return res.json({
				success: true,
				message: 'Crisis Already Exists'
			});
		} else {
			return res.json({
				success: false,
				message: 'Crisis Does Not Exists'
			});
		}
	});
};