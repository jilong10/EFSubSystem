const moment = require('moment');
const Firebase = require('../config').Firebase;
const crisisRef = Firebase.database().ref('Crisis');
const deploymentUnitRef = Firebase.database().ref('DeploymentUnit');
const unitRef = Firebase.database().ref('Unit');
const axios = require('axios');
const cmoApiUrl = require('../config').Url.cmoapiurl;

exports.sendToCmoApi = async (req, res) => {		
	const statusObj = {};
	const crisisSnapshot = await crisisRef.once('value');
	const crisisObj = crisisSnapshot.val();

	const deploymentUnitSnapshot = await deploymentUnitRef.once('value');
	const deploymentUnitObj = deploymentUnitSnapshot.val();

	statusObj['Crisis'] = crisisObj;
	statusObj['DeploymentUnit'] = deploymentUnitObj;
	res.json(statusObj);
};