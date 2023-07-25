import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { ArticleCard, ThemedIcon } from "~/common/components";
import { breakpoints, existingSections } from "~/common/constants";
import { useRootLoaderData } from "~/common/hooks";
import { isContentManager, langLink, notFound, parseLang } from "~/common/utils";
import { db } from "~/drizzle/db.server";
import { getUserSession } from "~/services/session.server";
import styles from "~/styles/routes/section/index.css";
import smMdStyles from "~/styles/routes/section/index.sm.md.css";
import xlgStyles from "~/styles/routes/section/index.xlg.css";


export const links = () => [
	{rel: "stylesheet", href: styles},
	{rel: "stylesheet", href: smMdStyles, media: `(max-width: ${breakpoints.md}px)`},
	{rel: "stylesheet", href: xlgStyles, media: `(min-width: ${breakpoints.md + 1}px)`},
];

export const meta: V2_MetaFunction = ({params}) => {
	const {t} = useTranslation();

	return [
		{title: t(`header.${params.section}`)},
		{property: "description", content: t("sectionDescription", {section: t(`header.${params.section}`)})},
	];
};

export const loader = async ({request, params}: LoaderArgs) => {
	const section = params.section! as typeof existingSections[number];
	const lang = parseLang(params.lang);
	if (!existingSections.includes(section)) throw notFound("Such section does not exist");

	const session = await getUserSession(request);
	let articles = await db.query.articles.findMany({
		where: (a, {eq, and}) => and(eq(a.lang, lang), eq(a.section, section)),
		columns: {title: true, slug: true, description: true, isDraft: true},
	});

	if (params.section === "information") {
		articles = articles.filter(a => a.slug === "archive" ? session.get("userId") : true);
	}
	const isContentManager = session.get("isContentManager");

	return {
		section,
		articles: articles?.filter(article => isContentManager || !article.isDraft)
			.map((article, i) => ({
				...article,
				order: i,
				link: langLink(lang, `${section}/${article.slug}`),
			})),
	};
};

const images: Record<typeof existingSections[number], {
	order: number,
	className: string,
	iconPath: string,
	mobileWidth?: number
}[]> = {
	about: [
		{order: 0, className: "icon", iconPath: "person/2"},
		{order: 8, className: "icon--big flip sm:none md:none", iconPath: "person/3"},
		{order: 50, className: "icon d-none sm:flex md:flex icon--footer", iconPath: "person/footer-2"},
	],
	admission: [
		{order: 0, className: "icon--big", iconPath: "person/4"},
		{order: 50, className: "icon d-none sm:flex md:flex icon--footer", iconPath: "person/footer-1"},
	],
	study: [
		{order: 0, className: "icon--big", iconPath: "person/5"},
		{order: 3, className: "icon--big flip sm:none md:none", iconPath: "person/6"},
		{order: 50, className: "icon d-none sm:flex md:flex icon--footer", iconPath: "person/footer-2"},
	],
	deanery: [
		{order: 0, className: "icon--big", iconPath: "person/5"},
		{order: 5, className: "icon--big  sm:none md:none", iconPath: "person/6"},
		{order: 50, className: "icon d-none sm:flex md:flex icon--footer", iconPath: "person/footer-1"},
	],
	information: [
		{order: 0, className: "icon--big", iconPath: "person/7"},
		{order: 10, className: "icon flip sm:none md:none", iconPath: "person/3"},
		{order: 50, className: "icon d-none sm:flex md:flex icon--footer", iconPath: "person/footer-3"},
	],
};


export default () => {
	const {section, articles} = useLoaderData<typeof loader>();
	const {user} = useRootLoaderData();
	const {t} = useTranslation();

	const grid = [...images[section], ...articles].sort((a, b) => a.order - b.order);

	return (
		<div className="page-width">
			<h2 className="visibly-hidden">{t(`header.${section}`)}</h2>
			<ul className="section-container">
				{articles.length
					? grid.map(i => (
						// @ts-ignore
						<li key={i.link ?? i.order} className={i.className}>
							{/* @ts-ignore */}
							{i.link ? <ArticleCard {...i} /> : <ThemedIcon path={i.iconPath} mobileWidth={i.mobileWidth} />}
						</li>
					))
					: <p>{t("emptySection")}</p>
				}
				{isContentManager(user) && (
					<li style={{order: articles.length + 2}}>
						<div className="card" style={{display: "flex", justifyContent: "center"}}>
							<Link
								to="null/edit" className="card__link"
								style={{display: "flex", alignItems: "center"}}
							>
								<svg width="3rem" height="3rem" viewBox="0 0 16 16">
									<g className="card__plus">
										<line x1="8" x2="8" y1="1" y2="15" />
										<line y1="8" y2="8" x1="1" x2="15" />
									</g>
								</svg>
							</Link>
						</div>
					</li>
				)}
			</ul>
		</div>
	);
}
