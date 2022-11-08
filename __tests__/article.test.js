const request = require('supertest');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const Article = require('../models/article');
const connectDB = require('../db/connect');
const app = require('../app');

let token;

beforeAll(async () => {
	await connectDB(process.env.MONGO_URI);

	const login = await request(app)
		.post('/users/login')
		.set('Content-Type', 'application/json')
		.send({
			email: 'test.admin@gmail.com',
			password: '123456',
		});
	token = login.body.data.token;

	const createArticle = await request(app)
		.post('/articles')
		.set('Content-Type', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({
			title: 'Test Article',
			description: 'Test description',
			body: 'Test body',
		});
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe('article', () => {
	test('get all articles', async () => {
		const res = await request(app)
			.get('/articles')
			.set('Content-Type', 'application/json');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toHaveProperty('articles');
	});

	test('get article by id', async () => {
		const article = await Article.findOne();
		const res = await request(app)
			.get(`/articles/${article._id}`)
			.set('Content-Type', 'application/json');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toHaveProperty('article');
	});

	test('create article', async () => {
		const res = await request(app)
			.post('/articles')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Test Article 1',
				description: 'Test description 1',
				body: 'Test body 1',
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toHaveProperty('article');
	});

	test('update article', async () => {
		const article = await Article.findOne({ title: 'Test Article' });
		const res = await request(app)
			.patch(`/articles/${article._id.toString()}`)
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Test Article Updated',
				description: 'Test description updated',
				body: 'Test body updated',
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toHaveProperty('article');
	});

	test('delete article', async () => {
		const article = await Article.findOne({ title: 'Test Article Updated' });
		const res = await request(app)
			.delete(`/articles/${article._id.toString()}`)
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('data');
	});
});
