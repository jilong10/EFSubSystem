const express = require('express');
const router = express.Router();
const deploymentPlanHelper = require('../helpers/deploymentplan-helper');

router.route('/ef')
	.get(deploymentPlanHelper.readDeploymentPlan)
	.post(deploymentPlanHelper.createDeploymentPaln);

router.route('/ef/:plan_id')
	.delete(deploymentPlanHelper.deleteDeploymentPlan);

module.exports = router;

// Route 						| Method	| Description
// ---------------------------------------------------------------------------
// api/ef 		 	 			| GET 	 	| Read all deployment plan
// api/ef 						| POST 	 	| Create new deployment plan
// api/ef/:plan_id 				| DELETE 	| Delete deployment plan
