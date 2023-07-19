import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { ArticleCard, ThemedIcon } from "~/common/components";
import { ProcessorIcon } from "~/common/components/Icons";
import { breakpoints } from "~/common/constants";
import { parseLang } from "~/common/utils/language";
import { db } from "~/services/db.server";
import style from "~/styles/routes/index.css";


export const links = () => ([
	{rel: "preload", href: "/fonts/Pi.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous"},
	{rel: "stylesheet", href: style},
]);

export const meta: V2_MetaFunction<typeof loader> = () => {
	const {t} = useTranslation("homepage");

	return [
		{title: t("meta.title")},
		{property: "description", content: t("meta.description")},
		{property: "og:title", content: t("main.h1")},
		{property: "og:description", content: t("main.p")},
	];
};

export const handle = {
	i18n: "homepage",
};

export const loader = async ({params}: LoaderArgs) => {
	const lang = parseLang(params.lang);
	const news = await db.news.findMany({
		where: {lang},
		select: {id: true, title: true, source: true, createdAt: true},
		orderBy: {createdAt: "desc"},
		take: 3,
	});

	return {
		news: news.map(n => {
			n.source = n.source.substring(0, 200) + "...";
			return n;
		}),
	};
};


export default () => {
	const {lang} = useParams();
	const {news} = useLoaderData<typeof loader>();
	const {t} = useTranslation("homepage");

	return (
		<div className="page-width">
			<section className="main-block">
				<div>
					<h1>{t("main.h1")}</h1>
					<p>{t("main.p")}</p>
					<Link className="button button--primary" to="/uk/about">{t("main.more")}</Link>
				</div>
				<ThemedIcon path="person/1" mobileWidth={breakpoints.md} />
			</section>

			<section className="specialities-block">
				<h2>{t("specialities.h2")}</h2>
				<div className="specialities">
					<ArticleCard
						img={<span className="card__img pi" aria-hidden={true}>π</span>}
						title={t("specialities.113.title")}
						link={`/${lang}/about/specialities#spetsialnist-113-prykladna-matematyka`}
						description={t("specialities.113.description")}
						draft={false}
					/>
					<ArticleCard
						img={<span className="card__img" aria-hidden={true}>{"{ }"}</span>}
						title={t("specialities.121.title")}
						link={`/${lang}/about/specialities#spetsialnist-121-inzheneriia-prohramnoho-zabezpechennia`}
						description={t("specialities.121.description")}
						draft={false}
					/>
					<ArticleCard
						img={<span className="card__img" aria-hidden={true}><ProcessorIcon /></span>}
						title={t("specialities.123.title")}
						link={`/${lang}/about/specialities#spetsialnist-123-kompiuterna-inzheneriia`}
						description={t("specialities.123.description")}
						draft={false}
					/>
				</div>
				<div>
					<Link className="button" to={`/${lang}/about/specialities`}>{t("specialities.more")}</Link>
				</div>
			</section>

			<section className="news-block">
				<h2>{t("news.h2")}</h2>
				<div className="news-container">
					{news.map(n => <ArticleCard
						key={n.id}
						title={n.title}
						description={n.source}
						draft={false}
						link={`/${lang}/information/news/${n.id}`}
					/>)}
				</div>
				<ThemedIcon path="person/8" />

				<Link className="button button--primary" to={`/${lang}/information/news`}>{t("news.more")}</Link>
			</section>
		</div>
	);
}


