import React from 'react';
import ErrorPage from 'next/error';

export default function _404Page() {
	return <ErrorPage statusCode={404} />;
}
