const moment = require('moment');
const Crisis = require('../models/crisis');
const Enemy = require('../models/enemy');
const Firebase = require('../config/database');
const deploymentPlanRef = Firebase.database().ref('DeploymentPlan');

