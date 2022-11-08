require('dotenv').config();

const app = require('./app');
const connectDB = require('./db/connect');

const port = process.env.PORT || 3000;


const start = async () => {
	try {
		// connect DB
		await connectDB(process.env.MONGO_URL);
		app.listen(port);
	} catch (error) {
		console.log(error);
	}
};

start();
