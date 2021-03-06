// Check whether the user already login
exports.isLoggedIn = (req, res, next) => {
	if (req.session.user && req.session.name) {
		return next();
	}
	res.redirect('/login');
}

exports.isNotLoggedIn = (req, res, next) => {
	if (!req.session.user || !req.session.name) {
		return next();
	}
	res.redirect('/');
}