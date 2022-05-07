const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	_id: String,
	username: String,
	password: String,
	email: String,
	name: String,
	pronouns: String,
});

module.exports = mongoose.model('User', userSchema);
