import { NavLink } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { existingSections } from '~/common/constants';
import { useRootLoaderData } from '~/common/hooks';
import { cx } from '~/common/utils';


export const NavBar = ({isPopup = false}) => {
	const {t} = useTranslation();
	const {lang} = useRootLoaderData();

	return (
		<nav className={cx('nav', isPopup ? 'xlg:none' : 'd-none xlg:flex')}>
			<ul className='nav__list'>
				{existingSections.map(section => (
					<li key={section} className='nav__list-item'>
						<NavLink to={`/${lang}/${section}`}>{t(`header.${section}`)}</NavLink>
					</li>
				))}
			</ul>
		</nav>
	);
};
