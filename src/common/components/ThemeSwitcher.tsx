import { useFetcher, useLocation } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { isBrowser } from '~/common/constants';
import { useRootLoaderData } from '~/common/hooks';


export const ThemeSwitcher = () => {
	const {pathname} = useLocation();
	const fetcher = useFetcher();
	const {t} = useTranslation();
	const {theme} = useRootLoaderData();

	const actualTheme = theme || ((isBrowser && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark');

	return (
		<fetcher.Form method='post' action={`/actions/theme?redirectTo=${pathname}`}>
			<button
				className='theme-switcher'
				aria-live='polite'
				name='theme'
				value={actualTheme}
			>
				<svg
					className='sun-and-moon' aria-hidden='true' width='1.3rem' height='1.3rem'
					viewBox='0 0 24 24'
					strokeLinecap='round'
				>
					<circle className='sun' cx='12' cy='12' r='6' mask='url(#moon-mask)' />
					<g className='sun-beams'>
						<line x1='12' y1='1' x2='12' y2='3' />
						<line x1='12' y1='21' x2='12' y2='23' />
						<line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
						<line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
						<line x1='1' y1='12' x2='3' y2='12' />
						<line x1='21' y1='12' x2='23' y2='12' />
						<line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
						<line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
					</g>
					<mask className='moon' id='moon-mask'>
						<rect x='0' y='0' width='100%' height='100%' />
						<circle cx='24' cy='10' r='3' />
					</mask>
				</svg>
				<span>{t(`menu.switchTo.${actualTheme}`)}</span>
			</button>
		</fetcher.Form>
	);
};
