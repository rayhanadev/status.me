import React from 'react';
import { useRouter } from 'next/router';

import Head from '../../components/Head/Head.js';
import Navigation from '../../components/Navigation/Navigation.js';
import Card from '../../components/Card/Card.js';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from '../../libs/auth.js';
import styles from '../../styles/Post.module.scss';

const POST_BY_ID = gql`
  query PostById($id: String!) {
    post(id: $id) {
			id
			timestamp
			type
			message
			author
			mood {
				color
				emoji
				message
			}
		}
  }
`;

export default function Post() {
	const router = useRouter();
	const { id } = router.query;
	const { isSignedIn } = useAuth();
	const { loading, data } = useQuery(POST_BY_ID, {
		variables: { id },
	});

	return (
		<div>
			<Head />
			<div className="title">&nbsp;</div>
			<Navigation isSignedIn={isSignedIn()} />
			<div className={styles.cardBox}>
				<Card type={'large'} data={loading ? {} : data.post} />
			</div>
		</div>
	);
}
