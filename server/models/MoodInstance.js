const MongoPaging = require('mongo-cursor-pagination');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moodSchema = new Schema({
	_id: String,
	timestamp: { type: Date, default: Date.now() },
	color: {
		type: String,
		required: () => /^#([0-9A-F]{3}){1,2}$/i.test(this.color),
	},
	emoji: String,
	message: String,
});
moodSchema.plugin(MongoPaging.mongoosePlugin);

module.exports = mongoose.model('Mood', moodSchema);
