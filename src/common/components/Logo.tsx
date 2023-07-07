import { Link, useParams } from '@remix-run/react';
import { useTranslation } from 'react-i18next';


export const Logo = () => {
	const {t} = useTranslation();
	const {lang} = useParams();
	return (
		<Link to={lang === 'en' ? '/en' : '/'} className='logo' aria-label={t('aria.logo')}>
			{t('FPM')}
		</Link>
	);
};
