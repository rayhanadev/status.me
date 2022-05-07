import React from 'react';
import Head from 'next/head';

export default function HeadComponent({ title }) {
	return (
		<Head>
			<title>{title ? `${title}` : 'status.me'}</title>
		</Head>
	);
}
