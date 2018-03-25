$(document).ready(function() {
	$('.navbar-nav a[href="' + location.pathname + '"]').addClass('active');

	findDeploymentPlanStatus();
	setInterval(() => {		
		findDeploymentPlanStatus();
	}, 5000);
});

function findDeploymentPlanStatus() {
	fetch('./api/ef/status')
		.then(res => res.json())
		.then(data => {				
			if (data.status) {
				showNotification('primary', 'New Deployment Plan Arrive');
				setDeploymentPlanStatus({
					status: false
				});
			}
		})
		.catch(err => {
			console.log('The deployment plan status service is unavailable right now. Please try again later.');
		});
}

function setDeploymentPlanStatus(update) {
	fetch('./api/ef/status', {
		method: 'PUT',
		body: JSON.stringify(update),
		headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    }
	})
	.catch(err => {
		console.log('The deployment plan status service is unavailable right now. Please try again later.');
	});
}

function showNotification(alertType, msg) {
	var htmlAlert = `<div class="alert alert-${alertType} alert-dismissible">
                		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                		${msg}
            		</div>`;
	$(".alert-message").prepend(htmlAlert);    
}

function updateCrisisWithPlan(plan_id){
	var target = "./api/ef/updatecrisis/"+ plan_id;
	$.ajax({
		url:target,
		type: 'POST',
		success:function(msg){
			if (msg.success) {
        		//to check return message to confirm successful			
				showNotification('success', msg.message);
        	} else {
        		showNotification('danger', msg.message);
        	}
			
		},
        error: function() {
        	showNotification('danger', 'Update Failed');
        }
	});
}

function updateCrisisStatus(crisis_id){
	var target = "./api/statusupdate/crisis/" + crisis_id;
	var casualty_size = document.getElementById("casualty_size").value;
	var crisis_code = "GREEN";
	if(document.getElementById("crisis_code1").checked){
		crisis_code = "RED";
	}else if(document.getElementById("crisis_code2").checked){
		crisis_code = "YELLOW";
	}
    //window.alert(casualty_size + crisis_code);
    $.ajax({
        url:target,
        type: 'PUT',
		data:{crisis_code:crisis_code,casualty_size:casualty_size},
        success:function(msg){
        	if (msg.success) {
        		//to check return message to confirm successful
            	window.location.reload(true);
        	} else {
        		showNotification('danger', msg.message);
        	}
        },
        error: function() {
        	showNotification('danger', 'Update Failed');
        }
    });
}

function updateEnemy(crisis_id, enemy_name, enemy_type,index){
	var target = "./api/statusupdate/crisis/"+ crisis_id +"/" + enemy_name;
	var enemy_size = document.getElementById("enemy_size"+index).value;
    var coor_x = document.getElementById("enemy_x"+index).value;
    var coor_y = document.getElementById("enemy_y"+index).value;
    var area = document.getElementById("enemy_area"+index).value;
    $.ajax({
		url:target,
		type:'PUT',
		data:{enemy_size:enemy_size,coordinate_x:coor_x,coordinate_y:coor_y,affect_area:area,enemy_type:enemy_type},
        success:function(msg){
            if (msg.success) {
                //to check return message to confirm successful
                window.location.reload(true);
            } else {
                showNotification('danger', msg.message);
            }
        },
        error: function() {
            showNotification('danger', 'Update Failed');
        }
	});
}

function addEnemy(crisis_id){
    var target = "./api/statusupdate/crisis/"+ crisis_id;
    var name = document.getElementById("enemy_name").value;
    var type = getTypeFromName(name);
    var size = document.getElementById("enemy_size").value;
    var coor_x = document.getElementById("enemy_x").value;
    var coor_y = document.getElementById("enemy_y").value;
    var area = document.getElementById("enemy_area").value;

    $.ajax({
        url:target,
        type:'POST',
        data:{enemy_name:name,enemy_size:size,enemy_type:type,coordinate_x:coor_x,coordinate_y:coor_y,affect_area:area},
        success:function(msg){
            if (msg.success) {
                //to check return message to confirm successful
                window.location.reload(true);
            } else {
                showNotification('danger', msg.message);
            }
        },
        error: function() {
            showNotification('danger', 'Update Failed');
        }
    });
}

function deleteEnemy(crisis_id, enemy_name){
    var target = "./api/statusupdate/crisis/"+ crisis_id +"/" + enemy_name;

    $.ajax({
        url:target,
        type: 'DELETE',
        success:function(msg){
            if (msg.success) {
                //to check return message to confirm successful
                window.location.reload(true);
            } else {
                showNotification('danger', msg.message);
            }
        },
        error: function() {
            showNotification('danger', 'Update Failed');
        }
    });
}

function getTypeFromName(enemy_name){
	var type = "LAND";
	if(enemy_name == "Dolphin Rider Zombie" || enemy_name == "Ducky Tube Zombie" || enemy_name == "Snorkel Zombie"){
		type = "SEA";
	}else if(enemy_name == "Balloon Zombie"){
		type = "AIR";
	}
	return type;
}

function deploy(id, unitType) {
    const size = document.getElementById(id + 'Input').value;
    if (size > 0) {
        const target = `./api/ordergenerator/deploymentunit/${id}/increasesize`;

        $.ajax({
            url: target,
            type: 'PUT',
            data: { number: size },
            success: function(msg) {
                if (msg.success) {
                    //to check return message to confirm successful
                    window.location.reload(true);
                } else {
                    if (msg.message == 'Unit not deploy yet') {
                        showDeploymentUnit(true, id, unitType);
                    } else  {
                        showNotification('danger', msg.message);
                    }                                    
                }
            },
            error: function() {
                showNotification('danger', 'Update Failed');
            }
        });
    } else {
        showNotification('danger', 'Please input a number');
    }
}

function showDeploymentUnit(show, unitName, unitType) {
    let deploymentUnitForm = document.getElementById('newDeploymentUnitForm');

    if (show) {
        newDeploymentUnitForm.classList.remove('hide'); 
    } else {
        newDeploymentUnitForm.classList.add('hide'); 
    }

    let unitNameLabel = document.getElementById('unit_name');
    unitNameLabel.innerHTML = unitName;
    let unitTypeLabel = document.getElementById('unit_type');    
    unitTypeLabel.innerHTML = unitType;
}

function addDeploymentUnit() {
    const unitName = document.getElementById('unit_name').innerHTML;
    const unitType = document.getElementById('unit_type').innerHTML;
    const currentUnitSize = document.getElementById(unitName + 'Input').value;
    const coordinateX = document.getElementById("coordinate_x").value;
    const coordinateY = document.getElementById("coordinate_y").value;
    const unitStatus = 'DEPLOYED';

    const target = './api/ordergenerator/deploymentunit';
    $.ajax({
        url: target,
        type: 'POST',
        data: { unit_name: unitName, unit_type: unitType, current_unit_size: currentUnitSize, coordinate_x: coordinateX, coordinate_y: coordinateY, unit_status: unitStatus },
        success: function(msg) {
            if (msg.success) {
                //to check return message to confirm successful         
                window.location.reload(true);
            } else {
                showNotification('danger', msg.message);
            }
            
        },
        error: function() {
            showNotification('danger', 'Deploy Failed');
        }
    });
}

function cancelDeploymentUnit() {
    showDeploymentUnit(false, '', '');
}