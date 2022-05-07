const _ = require('lodash');
const { project } = require('../graphql/projection.js');

async function mood(parent, args, context, info) {
	const proj = project(info);

	if (_.keys(proj).length === 1) {
		return parent.mood.map((id) => ({ _id: id }));
	}
	await context.models.Post.populate(parent, { path: 'mood', select: proj });
	return parent.mood;
}

module.exports = {
	mood,
};
