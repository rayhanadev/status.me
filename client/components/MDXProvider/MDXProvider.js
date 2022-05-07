import Image from 'next/image';
import Link from 'next/link';
import { MDXProvider } from '@mdx-js/react';
import styles from './MDXProvider.module.scss';

const CustomLink = (props) => {
	const { href } = props;
	const isInternalLink =
		href && (href.startsWith('/') || href.startsWith('#'));

	if (isInternalLink) {
		return (
			<Link href={href}>
				<a {...props} className={styles.link}>
					{props.children}
				</a>
			</Link>
		);
	}

	return (
		<a
			target="_blank"
			className={styles.link}
			rel="noopener noreferrer"
			{...props}
		>
			{props.children}
		</a>
	);
};

const CustomImage = (props) => (
	<Image alt={props.alt} layout="responsive" {...props} />
);

export default function MDXCompProvider(props) {
	const components = {
		h1: (props) => <div {...props} className={styles.title} />,
		h2: (props) => <h2 {...props} />,
		h3: (props) => <h3 {...props} />,
		h4: (props) => <h4 {...props} />,
		p: (props) => <p {...props} className={styles.text} />,
		a: CustomLink,
		img: CustomImage,
	};

	return (
		<MDXProvider components={components}>
			<div {...props} />
		</MDXProvider>
	);
}
