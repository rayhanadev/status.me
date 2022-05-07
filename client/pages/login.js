import React, { useState, useEffect } from 'react';

import Head from '../components/Head/Head.js';
import Navigation from '../components/Navigation/Navigation.js';
import { useAuth } from '../libs/auth.js';
import { useRouter } from 'next/router';

import styles from '../styles/Auth.module.scss';

export default function Login() {
	const [animation, setAnimation] = useState(0);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const router = useRouter();
	const { signIn } = useAuth();

	useEffect(() => {
		const localName = localStorage.getItem('name');
		if (localName?.length > 0) setUsername(localName);
	}, []);

	const submitHandler = async (e) => {
		e.preventDefault();
		const result = await signIn({ username, password });
		if (result.data?.login?.message) {
			setAnimation(1);
			setTimeout(() => setAnimation(0), 820);
		}

		if (result.data?.login?.token) router.push('/');
	};

	return (
		<div>
			<Head title={'login'} />
			<div className="title">- login -</div>
			<Navigation />
			<div className={styles.container} animation={animation}>
				<div className={styles.section}>
					<label>username:</label>
					<input
						type={'username'}
						value={username}
						onChange={(event) => setUsername(event.target.value)}
					/>
					<label>password:</label>
					<input
						type={'password'}
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
					<button onClick={submitHandler}>submit</button>
				</div>
			</div>
		</div>
	);
}
