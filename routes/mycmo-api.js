const express = require('express');
const router = express.Router();
const myCmoHelper = require('../helpers').MyCmoHelper;

router.route('/')
	.get(myCmoHelper.sendToCmoApi);

router.route('/status')
	.get(myCmoHelper.statusUpdate);

module.exports = router;

// Route 							| Method	| Description
// ---------------------------------------------------------------------------------------------------------------
// api/mycmo 		 	 			| GET 	 	| Get all status update for crisis, deployment unit, unit, enemy
// api/mycmo/status 		 	 	| GET 	 	| Get all status update for crisis, deployment unit, unit, enemy
