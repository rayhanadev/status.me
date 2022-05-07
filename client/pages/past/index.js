import React, { useState, useEffect, useRef, useCallback } from 'react';

import Head from '../../components/Head/Head.js';
import Navigation from '../../components/Navigation/Navigation.js';
import Card from '../../components/Card/Card.js';
import { gql, useQuery, NetworkStatus } from '@apollo/client';
import { useAuth } from '../../libs/auth.js';

import styles from '../../styles/Past.module.scss';

import InfiniteScroll from 'react-infinite-scroll-component';

const RECENT_POSTS = gql`
  query RecentPosts($after: String) {
    posts(count: 5, order: NEW, after: $after) {
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
			pageInfo {
				hasNext
				nextCursor
			}
		}
  }
`;

export function getStaticProps() {
	return { props: {}, revalidate: 10 };
}

export default function Past() {
	const { isSignedIn, getAuthHeaders } = useAuth();
	const [posts, setPosts] = useState([]);
	const [hasNext, setHasNext] = useState(true);
	const [after, setAfter] = useState('');

	const {
		data: initialData,
		loading,
		error,
	} = useQuery(RECENT_POSTS, { after });

	const fetchData = async () => {
		const { data } = await fetch(
			`https://${window.location.hostname}/graphql`,
			{
				method: 'POST',
				headers: {
					...getAuthHeaders(),
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: `query RecentPosts($after: String) {
				    posts(count: 5, order: NEW, after: $after) {
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
							pageInfo {
								hasNext
								nextCursor
							}
						}
				  }
				`,
					variables: JSON.stringify({ after }),
				}),
			},
		).then((res) => res.json());

		if (data && data.posts) {
			setPosts([...posts, ...data.posts.items]);
			setHasNext(data.posts.pageInfo.hasNext);
			setAfter(data.posts.pageInfo.nextCursor);
		}
	};

	useEffect(() => {
		if (initialData && posts.length === 0) {
			console.log('Initial Data:', initialData);
			setPosts([...initialData.posts.items]);
			setHasNext(initialData.posts.pageInfo.hasNext);
			setAfter(initialData.posts.pageInfo.nextCursor);
		}
	}, [initialData, posts]);

	return (
		<div>
			<Head />
			<div className="title">- past-</div>
			<Navigation isSignedIn={isSignedIn()} />
			<InfiniteScroll
				dataLength={posts.length}
				next={fetchData}
				hasMore={true}
				loader={<React.Fragment></React.Fragment>}
				endMessage={<React.Fragment></React.Fragment>}
				className={styles.cardBox}
			>
				{posts.map((post) => (
					<Card type={'wide'} data={post} key={post.id} />
				))}
			</InfiniteScroll>
		</div>
	);
}
