const Firebase = require('../config').Firebase;
const crisisRef = Firebase.database().ref('Crisis');
const deploymentUnitRef = Firebase.database().ref('DeploymentUnit');
const unitRef = Firebase.database().ref('Unit');
const deploymentUnitStatusRef = Firebase.database().ref('DeploymentUnitStatus');
const deploymentUnitCostRef = Firebase.database().ref('DeploymentUnitCost');
const axios = require('axios');
const cmoApiUrl = require('../config').Url.cmoapiurl;

exports.statusUpdate = async (req, res) => {		
	const statusObj = {};
	const crisisSnapshot = await crisisRef.once('value');
	const crisisObj = crisisSnapshot.val();

	const deploymentUnitSnapshot = await deploymentUnitRef.once('value');
	const deploymentUnitObj = deploymentUnitSnapshot.val();

	const deploymentUnitStatusSnapshot = await deploymentUnitStatusRef.once('value');
	const deploymentUnitStatusObj = deploymentUnitStatusSnapshot.val();

	const deploymentUnitCostSnapshot = await deploymentUnitCostRef.once('value');
	const deploymentUnitCostObj = deploymentUnitCostSnapshot.val();

	statusObj['Crisis'] = crisisObj;
	statusObj['DeploymentUnit'] = deploymentUnitObj;
	statusObj['DeploymentUnitStatus'] = deploymentUnitStatusObj;
	statusObj['DeploymentUnitCost'] = deploymentUnitCostObj;

	res.json(statusObj);
};

exports.sendToCmoApi = async (req, res) => {		
	const statusObj = {};
	const crisisSnapshot = await crisisRef.once('value');
	const crisisObj = crisisSnapshot.val();

	const crisis = Object.keys(crisisObj).map(key => {
		crisisObj[key].id = key;
		return crisisObj[key];
	});

	const deploymentUnitSnapshot = await deploymentUnitRef.once('value');
	const deploymentUnitObj = deploymentUnitSnapshot.val();

	const deploymentUnitStatusSnapshot = await deploymentUnitStatusRef.once('value');
	const deploymentUnitStatusObj = deploymentUnitStatusSnapshot.val();

	const deploymentUnitCostSnapshot = await deploymentUnitCostRef.once('value');
	const deploymentUnitCostObj = deploymentUnitCostSnapshot.val();

	statusObj['Crisis'] = crisis[0];
	statusObj['DeploymentUnit'] = deploymentUnitObj;
	statusObj['DeploymentUnitStatus'] = deploymentUnitStatusObj;
	statusObj['DeploymentUnitCost'] = deploymentUnitCostObj;
	
	res.json(statusObj);
};