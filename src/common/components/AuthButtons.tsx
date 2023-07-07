import { Link, useFetcher } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useRootLoaderData } from '~/common/hooks';
import { isAdmin } from '~/common/utils';


export const AuthButtons = () => {
	const {lang, user} = useRootLoaderData();
	const fetcher = useFetcher();
	const {t} = useTranslation(['common', 'admin']);

	return (
		<div className='auth-buttons'>
			{user ? (<>
				<fetcher.Form method='post' action={`/${lang}/auth/sign-out`}>
					<button>{t('signOut')}</button>
				</fetcher.Form>
				{isAdmin(user) &&
					<Link className='button' to={`/${lang}/users`}>{t('users', {ns: 'admin'})}</Link>
				}
			</>) : (<>
				<Link to={`/${lang}/auth/sign-in`} className='button'>
					{t('signIn')}
				</Link>
				<Link to={`/${lang}/auth/sign-up`} className='button'>
					{t('signUp')}
				</Link>
			</>)}
		</div>
	);
};
