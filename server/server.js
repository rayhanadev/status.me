const path = require('path');
const { getUserId, Logger } = require('./utils.js');
const dev = process.env.NODE_ENV !== 'production';
const logger = new Logger();

if (dev) {
	const env = require('dotenv').config({
		path: path.resolve(process.cwd(), '.env.local'),
	});

	if (env.error) {
		logger.warn('an error occured setting up env', envConf.error);
	} else {
		logger.setup('loaded env from', path.sep + '.env.local');
	}
}

// ExpressJS (Server)
const http = require('http');
const express = require('express');

// ExpressJS (Middlewares)
const cookieParser = require('cookie-parser');

// MongoDB
const { connectDatabase, models } = require('./models/index.js');

// GraphQL
const { ApolloServer } = require('apollo-server-express');
const {
	ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core');
const schema = require('./graphql/index.js');

// SocketIO
const socketio = require('socket.io');

// Prepare Next App
const next = require('next');
const nextApp = next({ dev, dir: './client' });
const nextHandler = nextApp.getRequestHandler();

// NextApp Management
logger.setup('preparing NextJS Application');
nextApp.prepare().then(async () => {
	// Setup MongoDB
	logger.setup('preparing Database (MongoDB)');
	const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_PROJECT_NAME } =
		process.env;

	connectDatabase(
		dev
			? `${MONGODB_PROJECT_NAME}_store_dev`
			: `${MONGODB_PROJECT_NAME}_store_prod`,
	);

	const [clientApp, clientServer] = await main();

	if (dev) {
		logger.setup('preparing Server');

		clientServer.listen(3000, () => {
			logger.event(`client ready on http://localhost:${3000}/`);
		});
	} else {
		logger.setup('preparing Servers');

		for (let i = 0; i < (process.env.PROD_SERVER_COUNT || 1); i++) {
			clientServer.listen(3000 + i, () => {
				logger.event(
					`client ready at https://${process.env.PROD_SERVER_URL}:${
						port + i
					}/`,
				);
			});
		}
	}
});

async function main() {
	// ExpressJS Setup
	logger.setup('preparing ExpressJS Server');
	const apiApp = express();
	const clientApp = express();
	const clientServer = http.createServer(clientApp);

	// GraphQL Setup
	logger.setup('preparing GraphQL Server (Apollo)');
	const apollo = new ApolloServer({
		schema,
		context: ({ req }) => {
			return {
				...req,
				models,
				userId:
					req && req.headers.authorization ? getUserId(req) : null,
			};
		},
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
	});
	await apollo.start();
	apollo.applyMiddleware({ app: apiApp });

	// Websocket Management
	logger.setup('preparing Websockets (SocketIO)');
	const io = new socketio.Server();
	io.attach(clientServer);

	io.on('connection', (socket) => {
		logger.event('a socket connected');
		socket.emit('eventServerStatus', 'Hello World from Server :D!');

		socket.on('disconnect', () => {
			logger.event('a socket disconnect');
		});
	});

	// ExpressJS Management
	logger.setup('preparing ExpressJS middlewares');

	apiApp.use(express.json());
	apiApp.use(express.urlencoded({ extended: true }));
	apiApp.use(cookieParser());

	clientApp.use('/', apiApp);
	clientApp.use(express.json());
	clientApp.use(express.urlencoded({ extended: true }));
	clientApp.use(cookieParser());

	apiApp.use((req, res, next) => {
		req.context = { models };
		next();
	});

	clientApp.use((req, res, next) => {
		if (!/\/_next/.test(req.path) && !/\/__nextjs/.test(req.path)) {
			logger.info(`${req.method.toLowerCase()} page: ${req.path}`);
		}
		next();
	});

	logger.setup('preparing ExpressJS routes');
	clientApp.all('*', (req, res) => nextHandler(req, res));

	return [clientApp, clientServer];
}
