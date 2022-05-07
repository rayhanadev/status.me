const gqlProjection = require('graphql-advanced-projection');

module.exports = gqlProjection({
	Mood: {
		proj: {
			id: '_id',
		},
	},
	Post: {
		proj: {
			id: '_id',
		},
	},
	MoodConnection: {
		proj: {
			items: true,
			mood: true,
		},
	},
	PostConnection: {
		proj: {
			items: true,
		},
	},
});
