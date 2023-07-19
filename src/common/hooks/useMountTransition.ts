import { useEffect, useState } from "react";
import { isBrowser } from "~/common/constants";


const prefersReducedMotion = isBrowser && window.matchMedia("(prefers-reduced-motion: reduce)").matches;


export const useMountTransition = (isMounted: boolean, unmountDelay: number) => {
	const [hasTransitionedIn, setHasTransitionedIn] = useState(false);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		if (isMounted && !hasTransitionedIn) {
			setHasTransitionedIn(true);
		} else if (!isMounted && hasTransitionedIn) {
			timeoutId = setTimeout(() => setHasTransitionedIn(false), prefersReducedMotion ? 0 : unmountDelay);
		}

		return () => {
			clearTimeout(timeoutId);
		};
	}, [unmountDelay, isMounted, hasTransitionedIn]);

	return hasTransitionedIn;
};
