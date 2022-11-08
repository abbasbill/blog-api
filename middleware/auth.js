const jwt = require('jsonwebtoken');

const User = require('../models/user');

const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	try {
		if (
			!token &&
			req.baseUrl === '/articles' &&
			(req.method === 'GET' ||
				req.method === 'DELETE' ||
				req.method === 'PATCH' ||
				req.method === 'POST')
		) {
			return next();
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = await User.findById(decoded.id);

		next();
	} catch (error) {
		console.log({ error });
		return res.status(401).json({
			success: false,
			message: 'Not authorized to access this route',
		});
	}
};

module.exports = protect;
