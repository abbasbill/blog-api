const request = require('supertest');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const connectDB = require('../db/connect');
const app = require('../app');

beforeAll(async () => {
	await connectDB(process.env.MONGO_URI);
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe('user', () => {
	test('should register a user', async () => {
		const res = await request(app)
			.post('/users/register')
			.set('Content-Type', 'application/json')
			.send({
				email: 'test.admin@gmail.com',
				password: '123456',
				firstname: 'Test',
				lastname: 'Admin',
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toHaveProperty('user');
		expect(res.body.data).toHaveProperty('token');
	}, 10000);
});

describe('user', () => {
	test('should login a user', async () => {
		const res = await request(app)
			.post('/users/login')
			.set('Content-Type', 'application/json')
			.send({
				email: 'test.admin@gmail.com',
				password: '123456',
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toHaveProperty('user');
		expect(res.body.data).toHaveProperty('token');
	}, 10000);
});
