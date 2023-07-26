import { useTranslation } from "react-i18next";
import { AuthButtons, LanguageSwitcher, NavBar, ThemeSwitcher } from "~/common/components";
import { BurgerMenuIcon } from "~/common/components/Icons";
import { useScreen } from "~/common/hooks";


export const Menu = () => {
	const {xlg} = useScreen();
	const {t} = useTranslation("common");


	return (
		<>
			<div
				aria-label="Menu"
				id="menu"
				className="menu__popup"
				// @ts-ignore
				popover="auto"
				onClick={e => {
					// @ts-ignore
					if (e.target?.name !== "theme") {
						// @ts-ignore
						document.getElementById("menu")?.hidePopover();
					}
				}}
			>
				<div className="menu__popup-content">
					<div style={{display: "flex", justifyContent: "space-between", flexWrap: "wrap"}}>
						<LanguageSwitcher />
						<AuthButtons />

					</div>
					{!xlg && <NavBar isPopup />}
					<ThemeSwitcher />
				</div>
			</div>
			{/*@ts-ignore*/}
			<button id="menu-button" popovertarget="menu" aria-label="Toggle menu button">
				<BurgerMenuIcon />
			</button>
		</>
	);
};
