const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			unique: true,
			required: [true, 'product name must be provided'],
		},
		description: {
			type: String,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please provide a user'],
		},
		state: {
			type: String,
			enum: ['draft', 'published'],
			default: 'draft',
		},
		read_count: {
			type: Number,
			default: 0,
		},
		reading_time: {
			type: Number,
			default: 0,
		},
		tags: {
			type: String,
		},
		body: {
			type: String,
			require: [true, 'Please provide a body text'],
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
	},
	{ timeStamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
