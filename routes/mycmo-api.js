const express = require('express');
const router = express.Router();
const myCmoHelper = require('../helpers').MyCmoHelper;

router.route('/')
	.get(myCmoHelper.sendToCmoApi);

module.exports = router;

// Route 							| Method	| Description
// ---------------------------------------------------------------------------------------------------------------
// api/mycmo 		 	 			| GET 	 	| Get all status update for crisis, deployment unit, unit, enemy
