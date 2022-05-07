import React from 'react';

import Head from '../components/Head/Head.js';
import Navigation from '../components/Navigation/Navigation.js';
import Card from '../components/Card/Card.js';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from '../libs/auth.js';
import styles from '../styles/Home.module.scss';

const RECENT_POST = gql`
  query RecentPost {
    posts(count: 1, order: NEW) {
			items {
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
  }
`;

export default function Home() {
	const { isSignedIn } = useAuth();
	const { loading, error, data } = useQuery(RECENT_POST);

	return (
		<div>
			<Head />
			<div className="title">- status.me -</div>
			<Navigation isSignedIn={isSignedIn()} />
			<div className={styles.cardBox}>
				<Card
					type={'large'}
					data={loading ? {} : data.posts.items[0]}
				/>
			</div>
		</div>
	);
}
