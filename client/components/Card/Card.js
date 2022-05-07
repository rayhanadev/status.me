import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { format } from 'date-fns';
import { Twemoji } from 'react-emoji-render';

import styles from './Card.module.scss';

export default function Card({ type, data }) {
	return (
		<Link href={'/past/' + (data?.id ?? '')} passHref>
			<div className={styles['card_' + type]}>
				<div className={styles.card}>
					<div className={styles.profilepic}>
						<Image
							alt=""
							src="/profilepic.jpeg"
							objectFit="cover"
							layout="fill"
						/>
					</div>

					<div className={styles.timestamp}>
						<div className={styles.text}>
							{data?.timestamp
								? `On: ${format(
										Number(data.timestamp),
										' MMMM do, yyyy @ h:mmaaa',
								  )}`
								: ' '}
						</div>
					</div>

					<div className={styles.status}>
						<div className={styles.icon}>
							<Twemoji
								svg
								options={{
									baseUrl:
										'//twemoji.maxcdn.com/v/latest/svg/',
								}}
								text={
									data?.mood?.emoji ? data?.mood?.emoji : ' '
								}
							/>
						</div>
						<div className={styles.text}>
							{data?.mood?.message ?? ' '}
						</div>
					</div>

					<div className={styles.content}>
						<p className={styles.body}>
							{data?.type === 'POST' || data?.type === undefined
								? data?.message || ' '
								: `"${data?.message}"`}
						</p>
						{data?.type === 'POST' || data?.type === undefined ? (
							<p className={styles.author}>&nbsp;</p>
						) : (
							<p className={styles.author}>- {data?.author}</p>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}
