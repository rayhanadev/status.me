const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { customAlphabet } = require('nanoid');
const { project } = require('../graphql/projection.js');
const { Logger } = require('../utils.js');

const logger = new Logger();
const nanoid = customAlphabet('6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz', 10);

function validateUser(user) {
	const schema = Joi.object({
		username: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required(),
	});

	return schema.validate(user);
}

async function signup(parent, args, context, info) {
	if (process.env.NEXT_PUBLIC_ALLOW_SIGNUP === 'false')
		return { message: 'Signing up is not allowed at the current moment.' };

	const { error } = validateUser(args);
	if (error) {
		return { message: String(error.details[0].message) };
	}

	if ((await context.models.User.findOne({ email: args.email })) !== null) {
		return { message: 'User with that email address already exists.' };
	}

	const password = await bcrypt.hash(args.password, 10);
	const user = await context.models.User.create({
		_id: nanoid(),
		...args,
		password,
	});

	const token = jwt.sign(
		{ userId: user._id },
		process.env.JWT_SIGNING_SECRET,
	);

	return { token, user };
}

async function login(parent, { username, password }, context, info) {
	const user = await context.models.User.findOne({ username });
	if (!user) return { message: `Invalid username or password.` };

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) return { message: `Invalid username or password.` };

	const token = jwt.sign(
		{ userId: user._id },
		process.env.JWT_SIGNING_SECRET,
	);

	return { token, user };
}

async function createPost(parent, { createPostInput }, context, info) {
	const { userId } = context;

	if (!userId) return { message: 'User not authenticated.' };

	const { mood: moodInput, moodRef, ...input } = createPostInput;

	const existingMoodRef = await context.models.Mood.findOne(moodInput);

	let mood =
		moodRef ??
		(existingMoodRef !== null
			? existingMoodRef
			: await context.models.Mood.create({
					_id: nanoid(),
					timestamp: String(Date.now()),
					...moodInput,
			  }).then((data) => data._id));

	const post = await context.models.Post.create({
		_id: nanoid(),
		timestamp: String(Date.now()),
		mood,
		...input,
	});

	return post;
}

async function updatePost(
	parent,
	{ updatePostInput: { id, ...data } },
	context,
	info,
) {
	const { userId } = context;

	if (!userId) return { message: 'User not authenticated.' };

	return await context.models.Post.findOneAndUpdate({ id }, { ...data });
}

async function deletePost(parent, { deletePostInput: { id } }, context, info) {
	const { userId } = context;

	if (!userId) return { message: 'User not authenticated.' };

	return await context.models.Post.findOneAndDelete({ id });
}

module.exports = {
	signup,
	login,
	createPost,
	updatePost,
	deletePost,
};
