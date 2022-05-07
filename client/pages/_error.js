import React from 'react';
import ErrorPage from 'next/error';

export async function getServerSideProps({ res, err }) {
	console.log(res.statusCode);
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { props: { statusCode } };
}

export default function _ErrorPage({ statusCode }) {
	return <ErrorPage statusCode={statusCode} />;
}
