const Firebase = require('../config').Firebase;
const crisisRef = Firebase.database().ref('Crisis');
const deploymentUnitRef = Firebase.database().ref('DeploymentUnit');
const unitRef = Firebase.database().ref('Unit');
const deploymentUnitStatusRef = Firebase.database().ref('DeploymentUnitStatus');
const axios = require('axios');
const cmoApiUrl = require('../config').Url.cmoapiurl;

exports.sendToCmoApi = async (req, res) => {		
	const statusObj = {};
	const crisisSnapshot = await crisisRef.once('value');
	const crisisObj = crisisSnapshot.val();

	const deploymentUnitSnapshot = await deploymentUnitRef.once('value');
	const deploymentUnitObj = deploymentUnitSnapshot.val();

	const deploymentUnitStatusSnapshot = await deploymentUnitStatusRef.once('value');
	const deploymentUnitStatusObj = deploymentUnitStatusSnapshot.val();

	statusObj['Crisis'] = crisisObj;
	statusObj['DeploymentUnit'] = deploymentUnitObj;
	statusObj['DeploymentUnitStatus'] = deploymentUnitStatusObj;
	res.json(statusObj);
};