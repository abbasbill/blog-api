const Article = require('../models/article');
const User = require('../models/user');

const calculateReadingTime = (lengthOfArticle) => {
	const wordsPerMinute = 200;
	const minutes = lengthOfArticle / wordsPerMinute;
	const readTime = Math.ceil(minutes);
	return readTime;
};

const getAllArticles = async (req, res) => {
	const isUserAuthenticated = req.user;

	const limit = req.params.limit || 20;

	let articles;

	if (isUserAuthenticated) {
		articles = await Article.find({
			$or: [
				{ title: { $regex: req.params.search || '' } },
				{ tags: { $regex: req.params.search || '' } },
			],
		})
			.sort({ read_count: 1, reading_time: 1, timestamps: 1 })
			.limit(limit)
			.populate('author');

		await Article.updateMany(
			{
				$or: [
					{ title: { $regex: req.params.search || '' } },
					{ tags: { $regex: req.params.search || '' } },
				],
			},
			{
				$inc: {
					read_count: 1,
				},
			}
		);
	} else {
		articles = await Article.find({
			state: 'published',
			$or: [
				{ title: { $regex: req.params.search || '' } },
				{ tags: { $regex: req.params.search || '' } },
			],
		})
			.sort({ read_count: 1, reading_time: 1, timestamps: 1 })
			.limit(limit)
			.populate('author');

		await Article.updateMany(
			{
				state: 'published',
				$or: [
					{ title: { $regex: req.params.search || '' } },
					{ tags: { $regex: req.params.search || '' } },
				],
			},
			{
				$inc: {
					read_count: 1,
				},
			}
		);
	}
	if (!articles) {
		return res.status(404).json({
			status: 'fail',
			message: 'Article not found',
		});
	}

	articles.map(async (article) => {
		await Article.updateOne(
			{ _id: article._id },
			{
				$set: {
					reading_time:
						article.reading_time + calculateReadingTime(article.body.length),
				},
			}
		);
		return article;
	});

	articles = await Article.find({
		$or: [
			{ title: { $regex: req.params.search || '' } },
			{ tags: { $regex: req.params.search || '' } },
		],
	})
		.sort({ read_count: 1, reading_time: 1, timestamps: 1 })
		.limit(limit)
		.populate('author');

	res.status(200).json({
		status: 'success',
		data: {
			articles,
		},
	});
};

const getArticlesByAuthor = async (req, res) => {
	const isUserAuthenticated = req.user;

	let articles;

	articles = await Article.find({
		author: req.params.authorId,
		$or: [{ state: { $regex: req.params.state || '' } }],
	}).limit(5);

	if (!articles) {
		return res.status(404).json({
			status: 'fail',
			message: 'Article not found',
		});
	}

	if (!isUserAuthenticated || req.user._id.toString() !== req.params.authorId) {
		return res.status(401).json({
			status: 'fail',
			message: 'Not authorized to access this route',
		});
	}

	await Article.updateMany(
		{},
		{
			$inc: {
				read_count: 1,
			},
		}
	);

	articles.forEach(async (article) => {
		await Article.updateOne(
			{ _id: article._id },
			{
				$set: {
					reading_time:
						article.reading_time + calculateReadingTime(article.body.length),
				},
			}
		);
		return article;
	});

	articles = await Article.find({
		author: req.params.authorId,
		$or: [{ state: { $regex: req.params.state || '' } }],
	}).limit(5);

	res.status(200).json({
		status: 'success',
		data: {
			articles,
		},
	});
};

const getArticle = async (req, res) => {
	let article = await Article.findById(req.params.id);

	if (!article) {
		return res.status(404).json({
			status: 'fail',
			message: 'Article not found',
		});
	}

	if (
		article.state === 'draft' &&
		req.user._id.toString() !== article.author.toString()
	) {
		return res.status(401).json({
			status: 'fail',
			message: 'You are not authorized to access this article',
		});
	}

	article = await Article.findByIdAndUpdate(
		req.params.id,
		{
			read_count: ++article.read_count,
			reading_time:
				article.reading_time + calculateReadingTime(article.body.length),
		},
		{ new: true }
	).populate('author');

	res.status(200).json({
		status: 'success',
		data: {
			article,
		},
	});
};

const createArticle = async (req, res) => {
	const article = await Article.create({
		...req.body,
		author: req.user._id.toString(),
		state: 'draft',
	});

	res.status(201).json({
		status: 'success',
		data: {
			article,
		},
	});
};

const updateArticle = async (req, res) => {
	let article = await Article.findById(req.params.id);

	if (!article) {
		return res.status(404).json({
			status: 'fail',
			message: 'Article not found',
		});
	}

	if (req.user._id.toString() !== article.author.toString()) {
		return res.status(401).json({
			status: 'fail',
			message: 'You are not authorized to update this article',
		});
	}

	aticle = await Article.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({
		status: 'success',
		data: {
			article,
		},
	});
};

const publishArticle = async (req, res) => {
	let article = await Article.findById(req.params.id);

	if (!article) {
		return res.status(404).json({
			status: 'fail',
			message: 'Article not found',
		});
	}

	if (req.user._id.toString() !== article.author.toString()) {
		return res.status(401).json({
			status: 'fail',
			message: 'You are not authorized to publish this article',
		});
	}

	article = await Article.findByIdAndUpdate(
		req.params.id,
		{ state: 'published' },
		{ new: true }
	);
	res.status(200).json({
		status: 'success',
		data: {
			article,
		},
	});
};

const deleteArticle = async (req, res) => {
	const article = await Article.findById(req.params.id);

	if (!article) {
		return res.status(404).json({
			status: 'fail',
			message: 'Article not found',
		});
	}

	if (req.user._id.toString() !== article.author.toString()) {
		return res.status(401).json({
			status: 'fail',
			message: 'You are not authorized to delete this article',
		});
	}

	await Article.findByIdAndDelete(req.params.id);
	res.status(200).json({
		status: 'success',
		data: null,
	});
};

module.exports = {
	getAllArticles,
	getArticlesByAuthor,
	getArticle,
	createArticle,
	updateArticle,
	publishArticle,
	deleteArticle,
};
