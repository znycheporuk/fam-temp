import { Logo, Menu, NavBar } from '~/common/components';
import { useScreen } from '~/common/hooks';


export const Header = () => {
	const {xlg} = useScreen();

	return (
		<header className='header'>
			<div className='page-width'>
				<Logo />
				{xlg && <NavBar />}
				<Menu />
			</div>
		</header>
	);
};
