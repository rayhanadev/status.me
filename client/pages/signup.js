import React, { useState, useEffect, useRef } from 'react';

import Head from '../components/Head/Head.js';
import Navigation from '../components/Navigation/Navigation.js';
import styles from '../styles/Auth.module.scss';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const SIGNUP_MUTATION = gql`
 mutation SignUp($username: String!, $password: String!, $email: String!) {
   signup(email: $email, username: $username, password: $password) {
     __typename
     ...on Auth {
       token
       user {
         username
       }
     }
    
     ...on UserError {
       message
     }
   }
 }
`;

export default function Signup() {
	const [animation, setAnimation] = useState(0);
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [signup, { data }] = useMutation(SIGNUP_MUTATION);

	const router = useRouter();

	useEffect(() => {
		if (process.env.NEXT_PUBLIC_ALLOW_SIGNUP === 'false') router.push('/');
	});

	useEffect(() => {
		const localName = localStorage.getItem('name');
		if (localName?.length > 0) setUsername(localName);
	}, []);

	useEffect(() => {
		if (data?.signup?.message) {
			setAnimation(1);
			setTimeout(() => setAnimation(0), 820);
		}
		if (data?.signup?.token) router.push('/login');
	}, [data, router]);

	const submitHandler = async (e) => {
		e.preventDefault();
		signup({ variables: { email, username, password } });
	};

	return (
		<div>
			<Head title={'signup'} />
			<div className="title">- signup -</div>
			<Navigation />
			<div className={styles.container} animation={animation}>
				<div className={styles.section}>
					<label>email:</label>
					<input
						type={'email'}
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>
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
