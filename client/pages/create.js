import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Head from '../components/Head/Head.js';
import Navigation from '../components/Navigation/Navigation.js';

import Select from 'react-select';
import { Twemoji, toArray } from 'react-emoji-render';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../libs/auth.js';

const parseEmojis = (value) => {
	const emojisArray = toArray(value);

	const newValue = emojisArray.reduce((previous, current) => {
		if (typeof current === 'string') {
			return previous + current;
		}
		return previous + current.props.children;
	}, '');

	return !newValue.includes(':');
};

const EmojiPicker = (props) => {
	const ref = useRef();

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		async function setup() {
			const { Picker } = await import('emoji-mart');

			new Picker({
				...props,
				ref,
				native: false,
				set: 'twitter',
				emojiVersion: '14',
				previewPosition: 'none',
			});
		}
		setup();
	}, []);
	/* eslint-enable react-hooks/exhaustive-deps */

	return <div ref={ref} />;
};

import styles from '../styles/Create.module.scss';

const RECENT_MOODS = gql`
	query RecentMoods {
    moods(count: 10, order: NEW) {
			items {
        id
        color
        emoji
        message
      }
      pageInfo {
        hasNext
        nextCursor
        previousCursor
      }
		}
  }
`;

const CREATE_NEW_POST = gql`
  mutation CreateNewPost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
			__typename
			...on Post {
				id
			}

			...on UserError {
				message
			}
		}
  }
`;

const useComponentVisible = (initialIsVisible, callback) => {
	const [isComponentVisible, setIsComponentVisible] =
		useState(initialIsVisible);
	const ref = useRef(null);

	const handleClickOutside = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setIsComponentVisible(false);
			if (callback && typeof callback === 'function') callback();
		} else {
			setIsComponentVisible(true);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	return { ref, isComponentVisible, setIsComponentVisible };
};

export default function Create() {
	const { isSignedIn } = useAuth();
	const { data: recentMoods } = useQuery(RECENT_MOODS);
	const [mutateFunction, { data, loading, error }] =
		useMutation(CREATE_NEW_POST);
	const router = useRouter();

	const [type, setType] = useState({ value: 'POST', label: 'post' });
	const [message, setMessage] = useState('');
	const [author, setAuthor] = useState('');
	const [mood, setMood] = useState({
		color: '',
		emoji: '',
		message: '',
	});
	const [moodRef, setMoodRef] = useState('');

	const [createMood, setCreateMood] = useState(false);
	const [moodMessage, setMoodMessage] = useState('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [displayEmoji, setDisplayEmoji] = useState({});

	const { ref, isComponentVisible } = useComponentVisible(true, () => {
		setShowEmojiPicker(false);
	});

	const updateMoodViaSelect = (input) => {
		setMoodRef(input.value.id);
		setDisplayEmoji(input);
	};

	const updateMoodViaInput = (input) => {
		if (input.id) {
			setMood((prev) => ({
				...prev,
				emoji: `:${input.id}:`,
			}));
		} else {
			setMoodMessage(input);
			setMood((prev) => ({
				...prev,
				message: input,
			}));
		}
	};

	useEffect(() => {
		if (!isSignedIn()) router.push('/');
		if (data && data?.createPost?.__typename === 'Post') router.push('/');
	});

	return (
		<div>
			<Head />
			<div className="title">- create -</div>
			<Navigation isSignedIn={isSignedIn()} />
			<div className={styles.cardBox}>
				<div className={styles.editor}>
					<div className={styles.card}>
						<div className={styles.profilepic}>
							<Image
								alt=""
								src="/profilepic.jpeg"
								objectFit="cover"
								layout="fill"
							/>
						</div>

						<div className={styles.status}>
							<div className={styles.icon}>
								{createMood ? (
									mood?.emoji &&
									mood.emoji.length > 0 &&
									parseEmojis(mood.emoji) ? (
										<Twemoji
											text={mood.emoji}
											options={{
												baseUrl:
													'//twemoji.maxcdn.com/v/latest/svg/',
											}}
											onClick={() =>
												setShowEmojiPicker(
													!showEmojiPicker,
												)
											}
											svg
										/>
									) : (
										<i
											className="fa-solid fa-plus-circle"
											onClick={() =>
												setShowEmojiPicker(
													!showEmojiPicker,
												)
											}
										></i>
									)
								) : displayEmoji?.value?.emoji &&
								  parseEmojis(displayEmoji.value.emoji) ? (
									<Twemoji
										text={displayEmoji.value.emoji}
										options={{
											baseUrl:
												'//twemoji.maxcdn.com/v/latest/svg/',
										}}
										svg
									/>
								) : (
									<i className="fa-solid fa-plus-circle"></i>
								)}
							</div>
							{createMood ? (
								<input
									className={styles.text}
									placeholder={'Insert your status...'}
									value={moodMessage}
									onChange={(event) =>
										updateMoodViaInput(event.target.value)
									}
								/>
							) : (
								<Select
									defaultValue={displayEmoji}
									onChange={updateMoodViaSelect}
									options={recentMoods?.moods?.items?.map(
										({ id, emoji, message }) => ({
											label: message,
											value: { id, emoji },
										}),
									)}
									isSearchable={true}
									styles={{
										option: (provided, state) => ({
											...provided,
											height: '3rem',
											background: state.isSelected
												? '#49b6b6'
												: '#fff',
											border: 'none',
											outline: 'none',
											margin: '0',
											padding: '0 1.5rem',
											fontSize: '1.6rem',
										}),
										indicatorSeparator: (
											provided,
											state,
										) => ({
											...provided,
											backgroundColor: '#3c3c3c',
										}),
										singleValue: (provided, state) => ({
											...provided,
											fontSize: '1.8rem',
											marginTop: '-0.35rem',
											'@media (max-width: 768px)': {
												fontSize: '1.4rem',
												marginTop: '-0.25rem',
											},
										}),
										dropdownIndicator: (
											provided,
											state,
										) => ({
											...provided,
											marginTop: '0.15rem',
											color: '#000',
											'&:hover': {
												color: '#49b6b6',
											},
											'&:focus': {
												color: '#49b6b6',
											},
											'&:active': {
												color: '#49b6b6',
											},
											'@media (max-width: 768px)': {
												marginTop: '-0.05rem',
											},
										}),
										control: (provided, state) => ({
											...provided,
											height: '3rem',
											width: '13.5rem',
											background: 'none',
											border: 'none',
											outline: 'none',
											marginTop: '-0.5rem',
											'&:hover': {
												outline: 'none',
												border: 'none',
											},
											'&:focus': {
												outline: 'none',
												border: 'none',
											},
											'&:active': {
												outline: 'none',
												border: 'none',
											},
										}),
									}}
								/>
							)}
							<div
								className={styles.switch}
								onClick={() => setCreateMood(!createMood)}
							>
								<i className="fa-solid fa-up-down"></i>
							</div>
						</div>

						{showEmojiPicker && isComponentVisible ? (
							<div className={styles.picker} ref={ref}>
								<EmojiPicker
									onEmojiSelect={updateMoodViaInput}
								/>
							</div>
						) : (
							<React.Fragment></React.Fragment>
						)}

						<Select
							className={styles.type}
							defaultValue={type}
							onChange={setType}
							options={[
								{ value: 'POST', label: 'post' },
								{ value: 'QUOTE', label: 'quote' },
								{ value: 'LYRICS', label: 'lyrics' },
							]}
							isSearchable={false}
							styles={{
								option: (provided, state) => ({
									...provided,
									height: '3rem',
									background: state.isSelected
										? '#49b6b6'
										: '#fff',
									border: 'none',
									outline: 'none',
									margin: '0',
									padding: '0 1.5rem',
									fontSize: '1.6rem',
								}),
								indicatorSeparator: (provided, state) => ({
									...provided,
									backgroundColor: '#3c3c3c',
								}),
								singleValue: (provided, state) => ({
									...provided,
									marginTop: '-0.75rem',
									'@media (max-width: 768px)': {
										marginTop: '-0.25rem',
									},
								}),
								dropdownIndicator: (provided, state) => ({
									...provided,
									marginTop: '-0.15rem',
									color: '#000',
									'&:hover': {
										color: '#49b6b6',
									},
									'&:focus': {
										color: '#49b6b6',
									},
									'&:active': {
										color: '#49b6b6',
									},
									'@media (max-width: 768px)': {
										marginTop: 'auto',
									},
								}),
								control: (provided, state) => ({
									...provided,
									height: '3rem',
									width: '10rem',
									background: 'none',
									border: 'none',
									outline: 'none',
									marginTop: '-0.5rem',
									marginLeft: '0.75rem',
									'&:hover': {
										outline: 'none',
										border: 'none',
									},
									'&:focus': {
										outline: 'none',
										border: 'none',
									},
									'&:active': {
										outline: 'none',
										border: 'none',
									},
								}),
							}}
						/>

						<div className={styles.content}>
							<textarea
								className={styles.body}
								value={message}
								onChange={(event) =>
									setMessage(event.target.value)
								}
								placeholder={`Insert your ${type?.value?.toLowerCase()}...`}
							/>
							<input
								className={styles.author}
								value={author}
								onChange={({ target: { value } }) =>
									value !== '-'
										? setAuthor(
												'- ' +
													event.target.value.replace(
														/- /,
														'',
													),
										  )
										: setAuthor('')
								}
								disabled={type.value === 'POST'}
								placeholder={
									type.value === 'POST'
										? ''
										: type.value === 'QUOTE'
										? '- author'
										: '- artist'
								}
							/>
						</div>
					</div>
					<button
						className={styles.submitBtn}
						onClick={() => {
							mutateFunction({
								variables: {
									createPostInput: {
										type: type.value,
										message,
										author:
											author === ''
												? null
												: author.substring(2),
										moodRef:
											moodRef === '' ? null : moodRef,
										mood: mood === {} ? null : mood,
									},
								},
							});
						}}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
}
