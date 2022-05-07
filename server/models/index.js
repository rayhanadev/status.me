const mongoose = require('mongoose');

const User = require('./UserInstance.js');
const Post = require('./PostInstance.js');
const Mood = require('./MoodInstance.js');

module.exports = {
	models: {
		User,
		Post,
		Mood,
	},
	connectDatabase: (database = '') => {
		return mongoose.connect(
			`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@statusme-cluster.dfurc.mongodb.net/${database}`,
		);
	},
};
