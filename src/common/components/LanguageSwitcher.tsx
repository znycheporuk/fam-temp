import { NavLink, useLocation } from '@remix-run/react';


export const LanguageSwitcher = () => {
	const {pathname, search} = useLocation();
	let ukLink = (pathname === '/en' ? '/' : pathname.replace(/[^\/][-a-zA-Z]*/, 'uk')) + search;
	let enLink = (pathname === '/' ? '/en' : pathname.replace(/[^\/][-a-zA-Z]*/, 'en')) + search;

	return (
		<span className='language-switcher'>
      <NavLink
	      className='language-switcher__link'
	      to={ukLink}
	      lang='uk'
	      hrefLang='uk'
	      aria-label='Посилання на українську версію сайту'
      >
        Укр
      </NavLink>
      <svg width='0.1rem' height='1.3rem' viewBox='0 0 2 30' fill='none'>
        <line x1='1' y1='29' x2='0.999999' y2='1' stroke='var(--text-color)' strokeWidth='2' strokeLinecap='round' />
      </svg>
      <NavLink
	      className='language-switcher__link'
	      to={enLink}
	      lang='en'
	      hrefLang='en'
	      aria-label='Link to english version of the site'
      >
        Eng
      </NavLink>
    </span>
	);
};
