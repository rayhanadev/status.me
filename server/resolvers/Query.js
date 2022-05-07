const { project } = require('../graphql/projection.js');

async function currentUser(parent, args, context, info) {
	const proj = project(info);

	const result = await context.models.User.findById(context.userId, proj);
	return result?.toObject();
}

async function post(parent, { id }, context, info) {
	const proj = project(info);

	const result = await context.models.Post.findById(id, proj);
	return result?.toObject();
}

async function posts(parent, { after, count, order, unlisted }, context, info) {
	const proj = project(info);
	let paginatedField = 'timestamp';
	let sortAscending = false;

	switch (order) {
		case 'NEW': {
			paginatedField = 'timestamp';
			break;
		}
		case 'OLD': {
			paginatedField = 'timestamp';
			sortAscending = true;
			break;
		}
		default: {
			paginatedField = 'timestamp';
			sortAscending = false;
		}
	}

	for (key of Object.keys(proj)) {
		proj[key.replace('items.', '')] = proj[key];
		proj[key] = undefined;
	}

	const { results, next, hasNext, previous } =
		await context.models.Post.paginate({
			limit: count ?? 5,
			fields: proj,
			next: after ?? null,
			paginatedField,
			sortAscending,
		});

	return {
		items: results,
		pageInfo: {
			hasNext,
			nextCursor: next,
			previousCursor: previous,
		},
	};
}

async function mood(parent, { id }, context, info) {
	const proj = project(info);

	const result = await context.models.Mood.findById(id, proj);
	return result?.toObject();
}

async function moods(parent, { after, count, order }, context, info) {
	const proj = project(info);
	let paginatedField = 'timestamp';
	let sortAscending = false;

	switch (order) {
		case 'NEW': {
			paginatedField = 'timestamp';
			break;
		}
		case 'OLD': {
			paginatedField = 'timestamp';
			sortAscending = true;
			break;
		}
		default: {
			paginatedField = 'timestamp';
			sortAscending = false;
		}
	}

	for (key of Object.keys(proj)) {
		proj[key.replace('items.', '')] = proj[key];
		proj[key] = undefined;
	}

	const { results, next, hasNext, previous } =
		await context.models.Mood.paginate({
			limit: count ?? 5,
			fields: proj,
			next: after ?? null,
			paginatedField,
			sortAscending,
		});
	return {
		items: results,
		pageInfo: {
			hasNext,
			nextCursor: next,
			previousCursor: previous,
		},
	};
}

module.exports = {
	currentUser,
	mood,
	post,
	posts,
	moods,
};
