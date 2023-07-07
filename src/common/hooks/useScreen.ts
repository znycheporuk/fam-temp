import { useEffect, useState } from "react";
import { breakpoints, isBrowser } from "~/common/constants";


export const useScreen = (customMinWidth = 0, customMaxWidth = 10000) => {
	const [screen, setScreen] = useState({
		sm: !isBrowser,
		md: !isBrowser,
		lg: !isBrowser,
		xlg: !isBrowser,
		custom: !isBrowser,
	});

	if (!isBrowser) return screen;

	const calculateScreen = () => {
		let width = window.innerWidth;

		let sm = false;
		let md = false;
		let lg = false;
		let xlg = false;

		let custom = false;

		if (width < breakpoints.sm) {
			sm = true;
		} else if ((width > breakpoints.sm) && (width <= breakpoints.md)) {
			md = true;
		} else if ((width > breakpoints.md) && (width <= breakpoints.lg)) {
			lg = true;
		} else if (width >= breakpoints.lg) {
			xlg = true;
		}

		if ((width > customMinWidth) && (width <= customMaxWidth)) {
			custom = true;
		}

		setScreen({sm, md, lg, xlg, custom});
	};

	useEffect(() => {
		calculateScreen();
		window.addEventListener("resize", calculateScreen);

		return () => window.removeEventListener("resize", calculateScreen);
	}, []);

	return screen;
};

