import type { V2_MetaFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";


export const meta: V2_MetaFunction = () => {
	return [
		{title: "New Remix App"},
		{name: "description", content: "Welcome to Remix!"},
	];
};
export const loader = () => {
	return {message: "Hello World"};
};

export default function Index() {
	const {t} = useTranslation();
	return (
		<div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.8"}}>
			{t("FPM")}
			<h1>Welcome to Remix</h1>
			<ul>
				<li>
					<a
						target='_blank'
						href='https://remix.run/tutorials/blog'
						rel='noreferrer'
					>
						150m Quickstart Blog Tutorial
					</a>
				</li>
				<li>
					<a
						target='_blank'
						href='https://remix.run/tutorials/jokes'
						rel='noreferrer'
					>
						Deep Dive Jokes App Tutorial
					</a>
				</li>
				<li>
					<a target='_blank' href='https://remix.run/docs' rel='noreferrer'>
						Remix Docs
					</a>
				</li>
			</ul>
		</div>
	);
}
