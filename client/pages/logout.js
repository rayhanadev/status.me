import React, { useEffect } from 'react';

import Head from '../components/Head/Head.js';
import { useAuth } from '../libs/auth.js';
import { useRouter } from 'next/router';

export default function Login() {
	const router = useRouter();
	const { signOut } = useAuth();

	useEffect(() => {
		signOut();
		router.push('/login');
	});

	return (
		<div>
			<Head title={'logout'} />
		</div>
	);
}
