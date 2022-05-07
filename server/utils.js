const jwt = require('jsonwebtoken');
const chalk = require('chalk');

function getTokenPayload(token) {
	return jwt.verify(token, process.env.JWT_SIGNING_SECRET);
}

function getUserId(req, authToken) {
	if (req) {
		const authHeader = req.headers.authorization;
		if (authHeader) {
			const token = authHeader.replace('Bearer ', '');
			if (!token) {
				throw new Error('No token found');
			}
			const { userId } = getTokenPayload(token);
			return userId;
		}
	} else if (authToken) {
		const { userId } = getTokenPayload(authToken);
		return userId;
	}

	throw new Error('Not authenticated');
}

class Logger {
	constructor(prefixes) {
		this.prefixes = prefixes ?? {
			setup: chalk.blue('setup') + ' -',
			wait: chalk.cyan('wait') + '  -',
			error: chalk.red('error') + ' -',
			warn: chalk.yellow('warn') + '  -',
			ready: chalk.green('ready') + ' -',
			info: chalk.cyan('info') + '  -',
			event: chalk.magenta('event') + ' -',
			dev: chalk.green('dev') + ' -',
		};
	}

	setup(...message) {
		console.log(this.prefixes.setup, ...message);
	}

	wait(...message) {
		console.log(this.prefixes.wait, ...message);
	}

	error(...message) {
		console.error(this.prefixes.error, ...message);
	}

	warn(...message) {
		console.warn(this.prefixes.warn, ...message);
	}

	ready(...message) {
		console.log(this.prefixes.ready, ...message);
	}

	info(...message) {
		console.log(this.prefixes.info, ...message);
	}

	event(...message) {
		console.log(this.prefixes.event, ...message);
	}

	dev(...message) {
		console.log(this.prefixes.dev, ...message);
	}
}

module.exports = {
	JWT_SIGNING_SECRET: process.env.JWT_SIGNING_SECRET,
	getUserId,
	Logger,
};
