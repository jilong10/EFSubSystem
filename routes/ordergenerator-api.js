const express = require('express');
const router = express.Router();
const orderGeneratorHelper = require('../helpers/ordergenerator-helper');

router.route('/unit')
	.post(orderGeneratorHelper.createUnit);

router.route('/deploymentunit')
	.post(orderGeneratorHelper.createDeploymentUnit);

router.route('/unit/:unit_name')
	.put(orderGeneratorHelper.editUnit)
	.delete(orderGeneratorHelper.deleteUnit);

router.route('/unit/:unit_name/reduce')
	.put(orderGeneratorHelper.reduceUnitSize);

router.route('/unit/:unit_name/increase')
	.put(orderGeneratorHelper.increaseUnitSize);

router.route('/deploymentunit/:unit_name')
	.put(orderGeneratorHelper.editDeploymentUnit)
	.delete(orderGeneratorHelper.deleteDeploymentUnit);

router.route('/deploymentunit/:unit_name/increasesize')
	.put(orderGeneratorHelper.increaseDeploymentUnitSize);

router.route('/deploymentunit/:unit_name/increasecasualty')
	.put(orderGeneratorHelper.increaseDeploymentUnitCasualty);

router.route('/deploymentunit/:unit_name/updatestatus')
	.put(orderGeneratorHelper.updateDeploymentUnitStatus);

module.exports = router;

// Route 															| Method	| Description
// --------------------------------------------------------------------------------------------------------------------
// api/ordergenerator/unit 											| POST 	 	| New unit
// api/ordergenerator/unit/:unit_name 								| PUT 	 	| Edit unit
// api/ordergenerator/unit/:unit_name 								| DELETE 	| Delete unit
// api/ordergenerator/unit/:unit_name/reduce 						| PUT 		| Reduce unit size
// api/ordergenerator/unit/:unit_name/increase 						| PUT 		| Increase unit size
// api/ordergenerator/deploymentunit 								| POST 	 	| New deployment unit
// api/ordergenerator/deploymentunit/:unit_name 					| PUT 	 	| Edit deployment unit
// api/ordergenerator/deploymentunit/:unit_name 					| DELETE  	| Delete deployment unit
// api/ordergenerator/deploymentunit/:unit_name/increasesize 		| PUT 		| Increase deployment unit size
// api/ordergenerator/deploymentunit/:unit_name/increasecasualty 	| PUT 		| Increase deployment unit casualty
// api/ordergenerator/deploymentunit/:unit_name/updatestatus	 	| PUT 		| Update deployment unit status