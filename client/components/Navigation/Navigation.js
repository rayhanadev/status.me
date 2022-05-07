import React from 'react';
import Link from 'next/link';

import useLocalStorage from '../../libs/useLocalStorage.js';

import styles from './Navigation.module.scss';

export default function Navigation({ isSignedIn }) {
	const [username] = useLocalStorage('username');

	return (
		<nav className={styles.menu}>
			{username ? (
				<p className={styles.userInfo}>Hello @{username}!</p>
			) : (
				<React.Fragment></React.Fragment>
			)}

			<div className={styles.flexBreak} />
			<ul>
				{isSignedIn === true ? (
					<React.Fragment>
						<li>
							<Link href="/">
								<a>
									<i className="fa-solid fa-house"></i>
								</a>
							</Link>
						</li>
						<li>
							<Link href="/past">
								<a>past</a>
							</Link>
						</li>
						<li>
							<Link href="/about">
								<a>about</a>
							</Link>
						</li>
						<li>
							<Link href="/create">
								<a>create</a>
							</Link>
						</li>
					</React.Fragment>
				) : (
					<React.Fragment>
						<li>
							<Link href="/">
								<a>
									<i className="fa-solid fa-house"></i>
								</a>
							</Link>
						</li>
						<li>
							<Link href="/past">
								<a>past</a>
							</Link>
						</li>
						<li>
							<Link href="/about">
								<a>about</a>
							</Link>
						</li>
						<li>
							<Link href="/login">
								<a>login</a>
							</Link>
						</li>
					</React.Fragment>
				)}
			</ul>
		</nav>
	);
}
