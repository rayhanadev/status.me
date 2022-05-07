function __resolveType(obj) {
	if (obj.id) return 'Post';
	if (obj.message) return 'UserError';

	return null;
}

module.exports = { __resolveType };
