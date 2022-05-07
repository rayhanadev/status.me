import React from 'react';
import Head from 'next/head';

import MDXProvider from '../components/MDXProvider/MDXProvider.js';
import { AuthProvider } from '../libs/auth.js';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
	return (
		<React.Fragment>
			<MDXProvider>
				<Head>
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1"
					/>
				</Head>
				<AuthProvider>
					<Component {...pageProps} />
				</AuthProvider>
			</MDXProvider>
		</React.Fragment>
	);
}

export default MyApp;
