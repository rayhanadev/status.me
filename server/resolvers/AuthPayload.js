function __resolveType(obj) {
	if (obj.token) return 'Auth';
	if (obj.message) return 'UserError';

	return null;
}

module.exports = { __resolveType };
