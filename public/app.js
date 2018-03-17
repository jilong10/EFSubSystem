$(document).ready(function() {
	$('.navbar-nav a[href="' + location.pathname + '"]').addClass('active');

	findDeploymentPlanStatus();
	setInterval(() => {		
		findDeploymentPlanStatus();
	}, 5000);
});

function findDeploymentPlanStatus() {
	fetch('https://efsubsystem.herokuapp.com/api/ef/status')
		.then(res => res.json())
		.then(data => {				
			if (data.status) {
				showNotification('primary', 'New Deployment Plan Arrive');
				setDeploymentPlanStatus({
					status: false
				});
			}
		});
}

function setDeploymentPlanStatus(update) {
	fetch('https://efsubsystem.herokuapp.com/api/ef/status', { 
		method: 'PUT',
		body: JSON.stringify(update),
		headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    }
	});
}

function showNotification(alertType, msg) {
	var htmlAlert = `<div class="alert alert-${alertType} alert-dismissible">
                		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                		${msg}
            		</div>`;
	$(".alert-message").prepend(htmlAlert);    
}