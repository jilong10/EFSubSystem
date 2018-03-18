const express = require('express');
const router = express.Router();
const deploymentPlanHelper = require('../helpers').DeploymentPlanHelper;

router.route('/')
	.get(deploymentPlanHelper.readDeploymentPlan)
	.post(deploymentPlanHelper.createDeploymentPlan);

router.route('/:plan_id')
	.delete(deploymentPlanHelper.deleteDeploymentPlan);

router.route('/status')
	.get(deploymentPlanHelper.readDeploymentPlanStatus)
	.put(deploymentPlanHelper.editDeploymentPlanStatus);

module.exports = router;

// Route 						| Method	| Description
// ------------------------------------------------------------------------------------------
// api/ef 		 	 			| GET 	 	| Read all deployment plan
// api/ef 						| POST 	 	| Create new deployment plan
// api/ef/:plan_id 				| DELETE 	| Delete deployment plan
// api/ef/status 		 	 	| GET 	 	| Read deployment plan status for new update
// api/ef/status 		 	 	| PUT 	 	| Edit the deployment plan status