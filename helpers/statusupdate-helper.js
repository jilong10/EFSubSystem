const moment = require('moment-timezone');
const Crisis = require('../models').Crisis;
const Enemy = require('../models').Enemy;
const Firebase = require('../config').Firebase;
const crisisRef = Firebase.database().ref('Crisis');
const deploymentUnitRef = Firebase.database().ref('DeploymentUnit');
const unitRef = Firebase.database().ref('Unit');
const deploymentUnitStatusRef = Firebase.database().ref('DeploymentUnitStatus');

exports.readCrisis = (req, res) => {	
	crisisRef.once('value', snapshot => {		
		return res.json(snapshot);
	});
};

exports.createCrisis = (req, res) => {	
	const crisisCode = req.body.crisis_code.toUpperCase();
	const noOfInjuries = Number(req.body.no_of_injuries);
	const noOfDeaths = Number(req.body.no_of_deaths);
	const landTroops = Number(req.body.land_troops);
	const seaTroops = Number(req.body.sea_troops);
	const airTroops = Number(req.body.air_troops);
	const budget = Number(req.body.budget);
	const missionType = req.body.mission_type.toUpperCase();
	const date = moment().tz("Asia/Singapore").format('DD/MM/YYYY');
	const time = moment().tz("Asia/Singapore").format(' HH:mm:ss');
	
	const crisis = new Crisis(crisisCode, noOfInjuries, noOfDeaths, landTroops, seaTroops, airTroops, budget, missionType, date, time);
	
	crisisRef
		.push()
		.set(crisis)
		.then(() => res.json({
			success: true,
			message: 'Crisis Added Successfully'
		}))
		.catch(err => res.json({
			success: false,
			message: 'Crisis Added Failed'
		}));
};

exports.editCrisis = (req, res) => {
	const crisisId = req.params.crisis_id;	
	const noOfInjuries = Number(req.body.no_of_injuries);
	const noOfDeaths = Number(req.body.no_of_deaths);
	const date = moment().tz("Asia/Singapore").format('DD/MM/YYYY');
	const time = moment().tz("Asia/Singapore").format(' HH:mm:ss');	

	const crisis = {
		'noOfInjuries': noOfInjuries,
		'noOfDeaths': noOfDeaths
	}

	crisisRef.child(crisisId)
		.once('value', snapshot => {
			if (snapshot.exists()) {
				crisisRef.child(crisisId)
					.update(crisis)
					.then(() => res.json({
						success: true,
						message: 'Crisis Updated Successfully'
					}))
					.catch(err => res.json({
						success: false,
						message: 'Crisis Updated Failed'
					}));
			} else {
				return res.json({
					success: false,
					message: 'Invalid crisis id'
				});
			}
		});
};

exports.deleteCrisis = (req, res) => {
	const crisisId = req.params.crisis_id;

	crisisRef.child(crisisId)
		.once('value', snapshot => {
			if (snapshot.exists()) {
				crisisRef.child(crisisId)
					.remove()
					.then(() => res.json({
						success: true,
						message: 'Crisis Deleted Successfully'
					}))
					.catch(err => res.json({
						success: false,
						message: 'Crisis Deleted Failed'
					}));
			} else {
				return res.json({
					success: false,
					message: 'Invalid crisis id'
				});	
			}
		});
};

exports.createEnemy = (req, res) => {
	const crisisId = req.params.crisis_id;
	const enemyName = req.body.enemy_name;
	const enemySize = Number(req.body.enemy_size);
	const enemyType = req.body.enemy_type.toUpperCase();
	const coordinateX = Number(req.body.coordinate_x);
	const coordinateY = Number(req.body.coordinate_y);
	const affectArea = Number(req.body.affect_area);
	const timestamp = {
		'date': moment().tz("Asia/Singapore").format('DD/MM/YYYY'),
		'time': moment().tz("Asia/Singapore").format(' HH:mm:ss')
	};

	crisisRef.child(crisisId).child('Enemy').child(enemyName)
		.once('value', snapshot => {
			if (snapshot.exists()) {
				return res.json({
					success: false,
					message: 'Enemy already exists'
				});
			}

			const enemy = new Enemy(enemyName, enemySize, enemyType, coordinateX, coordinateY, affectArea);

			crisisRef.child(crisisId).update(timestamp);

			crisisRef.child(crisisId).child('Enemy').child(enemyName)
				.set(enemy)
				.then(() => res.json({
					success: true,
					message: 'Enemy Added Successfully'
				}))
				.catch(err => res.json({
					success: false,
					message: 'Enemy Added Failed'
				}));
		});
};

exports.editEnemy = (req, res) => {
	const crisisId = req.params.crisis_id;
	const enemyName = req.params.enemy_name;
	const enemySize = Number(req.body.enemy_size);
	const enemyType = req.body.enemy_type.toUpperCase();
	const coordinateX = Number(req.body.coordinate_x);
	const coordinateY = Number(req.body.coordinate_y);
	const affectArea = Number(req.body.affect_area);
	const timestamp = {
		'date': moment().tz("Asia/Singapore").format('DD/MM/YYYY'),
		'time': moment().tz("Asia/Singapore").format(' HH:mm:ss')
	};
	crisisRef.child(crisisId).child('Enemy').child(enemyName)
		.once('value', snapshot => {
			const enemy = new Enemy(enemyName, enemySize, enemyType, coordinateX, coordinateY, affectArea);

			if (snapshot.exists()) {
				crisisRef.child(crisisId).update(timestamp);

				crisisRef.child(crisisId).child('Enemy').child(enemyName)
					.update(enemy)
					.then(() => res.json({
						success: true,
						message: 'Enemy Updated Successfully'
					}))
					.catch(err => res.json({
						success: false,
						message: 'Enemy Updated Failed'
					}));
			} else {
				return res.json({
					success: false,
					message: 'Invalid crisis id or enemy name'
				});
			}
		});
};

exports.deleteEnemy = (req, res) => {
	const crisisId = req.params.crisis_id;
	const enemyName = req.params.enemy_name;
	const timestamp = {
		'date': moment().tz("Asia/Singapore").format('DD/MM/YYYY'),
		'time': moment().tz("Asia/Singapore").format(' HH:mm:ss')
	};

	crisisRef.child(crisisId).child('Enemy').child(enemyName)
		.once('value', snapshot => {
			if (snapshot.exists()) {
				crisisRef.child(crisisId).update(timestamp);

				crisisRef.child(crisisId).child('Enemy').child(enemyName)
					.remove()
					.then(() => res.json({
						success: true,
						message: 'Enemy Deleted Successfully'
					}))
					.catch(err => res.json({
						success: false,
						message: 'Enemy Deleted Failed'
					}));
			} else {
				return res.json({
					success: false,
					message: 'Invalid crisis id or enemy name'
				});	
			}
		});
};

exports.readDeploymentUnit = (req, res) => {
	deploymentUnitRef.once('value', snapshot => {
		deploymentUnitStatusRef.once('value', statusSnapshot => {
			const obj = {
				'status': statusSnapshot,
				'deploymentunit': snapshot
			};

			return res.json(obj);
		});		
	});
};

exports.readUnit = (req, res) => {
	unitRef.once('value', snapshot => {
		return res.json(snapshot);
	});
};