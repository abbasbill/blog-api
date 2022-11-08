const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
	getAllArticles,
	getArticlesByAuthor,
	getArticle,
	createArticle,
	updateArticle,
	publishArticle,
	deleteArticle,
} = require('../controllers/articleController');

router.route('/').post(createArticle);

router.route('/author/:authorId/:state?').get(getArticlesByAuthor);

router
	.route('/:id')
	.get(getArticle)
	.post(publishArticle)
	.patch(updateArticle)
	.delete(deleteArticle);

router.route('/:limit?/:search?').get(getAllArticles);
module.exports = router;
