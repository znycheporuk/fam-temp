import { Link } from '@remix-run/react';


interface IBreadcrumbProps {
	base: string;
	paths: string[];
}

export const Breadcrumb = ({base, paths}: IBreadcrumbProps) => {
	const crumbs = paths.filter(v => !!v).map((path, i) => ({
		label: path,
		link: [base, ...paths.slice(0, i + 1)].join('/'),
	}));
	return (
		<nav>
			<ul className='breadcrumb'>
				{crumbs.map(crumb => <li key={crumb.link}><Link to={crumb.link}>{crumb.label}</Link></li>)}
			</ul>
		</nav>
	);
};
