const bcrypt = require('bcrypt-nodejs');

class User {
	constructor(name, username, password) {
		this.name = name;
		this.username = username;
		this.password = this.generateHash(password);
	}

	// Generate Hash
	generateHash(password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	}

	// Compare Hash
	static validPassword(password, hash) {
	    return bcrypt.compareSync(password, hash);
	}
}

module.exports = User;