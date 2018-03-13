const express = require('express');
const router = express.Router();
const statusupdateHelper = require('../helpers/statusupdate-helper');

router.route('/crisis')
	.get(statusupdateHelper.readCrisis)
	.post(statusupdateHelper.createCrisis);

router.route('/crisis/:crisis_id')	
	.put(statusupdateHelper.editCrisis)
	.delete(statusupdateHelper.deleteCrisis)
	.post(statusupdateHelper.createEnemy);

router.route('/crisis/:crisis_id/:enemy_name')	
	.put(statusupdateHelper.editEnemy)
	.delete(statusupdateHelper.deleteEnemy);

router.route('/deploymentunit')
	.get(statusupdateHelper.readDeploymentUnit);

router.route('/unit')
	.get(statusupdateHelper.readUnit);

module.exports = router;

// Route 												| Method	| Description
// -------------------------------------------------------------------------------------------------------
// api/statusupdate/crisis 								| GET 	 	| Display crisis
// api/statusupdate/crisis 								| POST 	 	| New crisis
// api/statusupdate/crisis/:crisis_id 					| PUT 	 	| Edit crisis
// api/statusupdate/crisis/:crisis_id 					| DELETE 	| Delete crisis
// api/statusupdate/crisis/:crisis_id			 		| POST 	 	| New crisis enemy
// api/statusupdate/crisis/:crisis_id/:enemy_name 		| PUT 	 	| Edit crisis enemy
// api/statusupdate/crisis/:crisis_id/:enemy_name 		| DELETE 	| Delete crisis enemy
// api/statusupdate/deploymentunit 						| GET 		| Display deployment unit status
// api/statusupdate/unit 								| GET 		| Display unit status