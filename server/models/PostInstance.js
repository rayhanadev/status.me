const MongoPaging = require('mongo-cursor-pagination');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
	_id: String,
	timestamp: { type: Date, default: Date.now() },
	type: { type: String, required: true, enum: ['POST', 'QUOTE', 'LYRICS'] },
	message: { type: String, required: true },
	author: String,
	mood: { type: String, required: true, ref: 'Mood' },
});
postSchema.plugin(MongoPaging.mongoosePlugin);

module.exports = mongoose.model('Post', postSchema);
