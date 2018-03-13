const moment = require('moment');
const Crisis = require('../models/crisis');
const Enemy = require('../models/enemy');
const Firebase = require('../config/database');
const deploymentPlanRef = Firebase.database().ref('DeploymentPlan');

exports.readDeploymentPlan = (req, res) => {
	deploymentPlanRef.once('value', snapshot => {
		return res.json(snapshot);
	});
};

exports.createDeploymentPlan = (req, res) => {	
	const crisisCode = req.body.crisis_code.toUpperCase();	
	const casualtySize = Number(req.body.casualty_size);
	const date = moment().format('DD/MM/YYYY');
	const time = moment().format(' HH:mm:ss');
	
	const crisis = new Crisis(crisisCode, casualtySize, date, time);

	var planId = deploymentPlanRef.push().key;
	
	deploymentPlanRef.child(planId)
		.set(crisis)
		.then(() => {
			const enemyName = req.body.enemy_name;
			const enemySize = Number(req.body.enemy_size);
			const enemyType = req.body.enemy_type.toUpperCase();
			const coordinateX = Number(req.body.coordinate_x);
			const coordinateY = Number(req.body.coordinate_y);
			const affectArea = Number(req.body.affect_area);

			const enemy = new Enemy(enemyName, enemySize, enemyType, coordinateX, coordinateY, affectArea);

			deploymentPlanRef.child(planId).child('Enemy').child(enemyName)
				.set(enemy)
				.then(() => res.json({
					success: true,
					message: 'Deployment Plan Added Successfully'
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