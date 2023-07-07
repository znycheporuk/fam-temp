import { useLocation } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthButtons, LanguageSwitcher, NavBar, ThemeSwitcher } from '~/common/components';
import { BurgerMenuIcon } from '~/common/components/Icons';
import { useMountTransition, useScreen } from '~/common/hooks';
import { cx } from '~/common/utils';


export const Menu = () => {
	const {xlg} = useScreen();
	const [expanded, setExpanded] = useState(false);
	const hasTransitionedIn = useMountTransition(expanded, 250);
	const menuRef = useRef<HTMLMenuElement>(null);
	const btnRef = useRef<HTMLButtonElement>(null);
	const {pathname} = useLocation();
	const {t} = useTranslation('common');

	useEffect(() => {
		if (!btnRef.current || !menuRef.current || !expanded) return;

		const onClick = (e: PointerEvent & any) => {
			if (!e.composedPath().some((el: HTMLElement) => el.classList?.contains('menu__popup') || el.classList?.contains('menu__button'))) {
				setExpanded(false);
			}
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setExpanded(false);
			}
		};

		const onBlurWithin = (e: any) => {
			const isFocusWithin = (node: HTMLElement) => {
				while (node !== document.body) {
					if (node.classList?.contains('menu__popup') || node.classList?.contains('menu__button')) {
						return true;
					}
					node = node.parentElement!;
				}
				return false;
			};

			if (!isFocusWithin(e.relatedTarget)) {
				setExpanded(false);
			}
		};

		addEventListener('pointerdown', onClick);
		addEventListener('keydown', onKeyDown);
		btnRef.current.addEventListener('focusout', onBlurWithin);
		menuRef.current.addEventListener('focusout', onBlurWithin);

		return () => {
			removeEventListener('pointerdown', onClick);
			removeEventListener('keydown', onKeyDown);
			btnRef.current?.removeEventListener('focusout', onBlurWithin);
			menuRef.current?.removeEventListener('focusout', onBlurWithin);
		};
	}, [btnRef.current, menuRef.current, expanded]);

	useEffect(() => {
		setExpanded(false);
	}, [pathname]);

	return (
		<>
			<button
				aria-haspopup={true}
				aria-expanded={expanded}
				aria-controls='menu'
				aria-label='Menu'
				className='menu__button noscript:hidden'
				id='menu-button'
				onClick={() => setExpanded(v => !v)}
				ref={btnRef}
			>
				<BurgerMenuIcon />
			</button>
			{(expanded || hasTransitionedIn) && (
				<menu
					aria-labelledby='menu-button'
					id='menu'
					className={cx('menu__popup', hasTransitionedIn && 'in', expanded && 'expanded')}
					ref={menuRef}
				>
					<div className='menu__popup-content'>
						<LanguageSwitcher />
						{!xlg && <NavBar isPopup />}
						<AuthButtons />
						<ThemeSwitcher />
					</div>
				</menu>
			)}
			<noscript>
				<details>
					<summary style={{cursor: 'pointer', userSelect: 'none'}}>{t('menu.summary')}</summary>
					<menu
						aria-labelledby='menu-button'
						id='menu'
						className='menu__popup in expanded'
					>
						<div className='menu__popup-content'>
							<LanguageSwitcher />
							<NavBar isPopup />
							<AuthButtons />
							<ThemeSwitcher />
						</div>
					</menu>
				</details>
			</noscript>
		</>
	);
};
