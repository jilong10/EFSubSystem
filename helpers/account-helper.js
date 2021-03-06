const User = require('../models').User;
const Firebase = require('../config').Firebase;
const userRef = Firebase.database().ref('User');

exports.register = (req, res) => {
	const name = req.body.name;
	const username = req.body.username;
	const password = req.body.password;

	if (!name) {
		return res.json({
			success: false,
			message: 'You must enter the name'
		});
	} else if (!username) {
		return res.json({
			success: false,
			message: 'You must enter the username'
		});
	} else if (!password) {
		return res.json({
			success: false,
			message: 'You must enter the password'
		});
	} 

	userRef.child(username)
		.once('value', snapshot => {
			if (snapshot.exists()) {
				return res.json({
					success: false,
					message: 'The account already exists'
				});
			}

			const user = new User(name, username, password);

			userRef.child(username)
				.set(user)
				.then(() => res.json({
					success: true,
					message: 'Register Successfully'
				}));		
		});
};

exports.login = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username) {
		return res.json({
			success: false,
			message: 'You must enter the username'
		});
	} else if (!password) {
		return res.json({
			success: false,
			message: 'You must enter the password'
		});
	}

	let name = '';

	userRef.child(username)
		.once('value', snapshot => {
			snapshot.forEach(childSnapshot => {
				if (childSnapshot.key === 'name') {
					name = childSnapshot.val();
				} else if (childSnapshot.key === 'password') {	
					if (User.validPassword(password, childSnapshot.val())) {

						return res.json({
							success: true,
							message: 'Login Successfully',
							name: name
						});
					} else {
						return res.json({
							success: false,
							message: 'Invalid Username/Password'
						});
					}
				}
			});			
		});
};