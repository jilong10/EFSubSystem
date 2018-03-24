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
        		showNotification('error', msg.message);
        	}
			
		},
        error: function() {
        	showNotification('error', 'Update Failed');
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
        		showNotification('error', msg.message);
        	}
        },
        error: function() {
        	showNotification('error', 'Update Failed');
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
                showNotification('error', msg.message);
            }
        },
        error: function() {
            showNotification('error', 'Update Failed');
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
                showNotification('error', msg.message);
            }
        },
        error: function() {
            showNotification('error', 'Update Failed');
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
                showNotification('error', msg.message);
            }
        },
        error: function() {
            showNotification('error', 'Update Failed');
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
