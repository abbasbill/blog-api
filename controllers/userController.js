const User = require('../models/user');
const Article = require('../models/article');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
	try {
		const user = await User.create({ ...req.body });
		const token = user.createJWT();

		res.status(201).json({
			status: 'success',
			data: {
				user,
				token,
			},
		});
	} catch (error) {
		console.log({ error });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			status: 'fail',
			message: 'Please provide email and password',
		});
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return res.status(401).json({
			status: 'fail',
			message: 'Incorrect email or password',
		});
	}

	const token = user.createJWT();

	res.status(200).json({
		status: 'success',
		data: {
			user,
			token,
		},
	});
};

module.exports = {
	register,
	login,
};
