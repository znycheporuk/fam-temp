import type { HTMLAttributes } from "react";
import { useOptimisticTheme } from "~/common/hooks";
import { cx } from "~/common/utils";


interface IThemedIcon extends HTMLAttributes<HTMLImageElement> {
	mobileWidth?: number;
	className?: string;
	path: string;
}

export const ThemedIcon = ({mobileWidth = 0, className, path, ...props}: IThemedIcon) => {
	const theme = useOptimisticTheme();

	const lightSrc = `/icons/${path}.svg`;
	const darkSrc = `/icons/${path}-dark.svg`;

	const mobileLightSrc = `/icons/${path}-m.svg`;
	const mobileDarkSrc = `/icons/${path}-m-dark.svg`;

	return theme && theme !== "auto"
		? (
			<picture className={cx("themed-icon", className)}>
				{!!mobileWidth && (
					<source srcSet={theme === "dark" ? mobileDarkSrc : mobileLightSrc} media={`(max-width: ${mobileWidth}px)`} />
				)}
				<img alt="" role="presentation" {...props} src={theme === "dark" ? darkSrc : lightSrc} />
			</picture>
		) : (
			<picture className={cx("themed-icon", className)}>
				{!!mobileWidth && (<>
					<source srcSet={mobileDarkSrc} media={`(prefers-color-scheme: dark) and (max-width: ${mobileWidth}px)`} />
					<source srcSet={mobileLightSrc} media={`(prefers-color-scheme: light) and (max-width: ${mobileWidth}px)`} />
				</>)}
				<source srcSet={darkSrc} media="(prefers-color-scheme: dark)" />
				<source srcSet={lightSrc} media="(prefers-color-scheme: light)" />
				<img alt="" role="presentation"  {...props} src={lightSrc} />
			</picture>
		);
};
