const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolversMongo = require('../resolvers/index.js');
const { resolvers: resolversGraphQL } = require('./projection.js');

module.exports = makeExecutableSchema({
	typeDefs: fs.readFileSync(
		path.join(__dirname, './schema.graphql'),
		'utf-8',
	),
	resolvers: _.merge(resolversMongo, resolversGraphQL),
});
