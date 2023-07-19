import { useEffect, useMemo, useRef } from "react";


export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
	func: F,
	waitFor: number,
): (...args: Parameters<F>) => void => {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<F>): void => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), waitFor);
	};
};

export const useDebounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(callback: F, delay: number): (...args: Parameters<F>) => void => {
	const ref = useRef<any>();

	useEffect(() => {
		ref.current = callback;
	}, [callback]);

	const debouncedCallback = useMemo((...args) => {
		const func = () => {
			ref.current?.(...args);
		};
		console.log("debounce", func, delay);
		return debounce(func, delay);
	}, []);

	return debouncedCallback;
};
