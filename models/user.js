const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: [true, 'email must be provided'],
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please provide a valid email',
			],
		},
		password: {
			type: String,
			required: [true, 'password must be provided'],
		},
		firstname: {
			type: String,
			required: [true, 'first name must be provided'],
		},
		lastname: {
			type: String,
			required: [true, 'last name must be provided'],
		},
		articles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Article',
			},
		],
	},
	{ timeStamps: true }
);

userSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
	return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
