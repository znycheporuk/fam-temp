import { HeadersFunction, json, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isDev } from "~/common/constants";
import { forbidden, message, notFound, parseLang } from "~/common/utils";
import { db } from "~/drizzle/db.server";
import { i18n } from "~/services/i18n.server";
import { getUserSession } from "~/services/session.server";


export const loader = async ({request, params}: LoaderArgs) => {
	const session = await getUserSession(request);
	const isContentManager = session.get("isContentManager");
	// TODO: use findFirst instead of findMany when it will be fixed by drizzle
	const [article] = await db.query.articles.findMany({
		where: (a, {eq, and}) => and(eq(a.lang, parseLang(params.lang)), eq(a.section, params.section as any)),
		columns: {title: true, description: true, keywords: true, html: true, articleLang: true, isDraft: true},
	});
	
	if (!article) {
		const t = await i18n.getFixedT(parseLang(params.lang), "server");
		throw notFound({message: t("article.doesntExist")});
	}

	if (article.isDraft && !isContentManager) throw forbidden({message: "Forbidden"});
	return json(article, {
		headers: {
			"Cache-Control": isDev ? "max-age=0" : "max-age=3600, s-maxage=3600",
		},
	});
};

export const headers: HeadersFunction = ({loaderHeaders}) => {
	return {
		"Cache-Control": loaderHeaders.get("Cache-Control") ?? "max-age=0",
	};
};

export const meta: V2_MetaFunction = ({data}) => {
	if (!data) {
		return [
			{title: "No Article"},
			{property: "description", content: "Such article does not exists"},
			{property: "keywords", content: ""},
		];
	}
	const {title, description, keywords} = data;

	return [
		{title},
		{property: "description", content: description},
		{property: "keywords", content: keywords},
	];
};


export default () => {
	const article = useLoaderData<typeof loader>();
	const {lang} = useParams();
	const {t} = useTranslation();

	useEffect(() => {
		if (parseLang(lang) !== article.articleLang) {
			message.info(t("articleOfDifferentLang"));
		}
	}, [article]);

	return (
		<div className="page-width">
			<article lang={article.articleLang} dangerouslySetInnerHTML={{__html: article.html}} />
		</div>
	);
}