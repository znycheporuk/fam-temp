import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { ArticleCard, ThemedIcon } from "~/common/components";
import { ProcessorIcon } from "~/common/components/Icons";
import { breakpoints } from "~/common/constants";
import { parseLang } from "~/common/utils/language";
import { db } from "~/services/db.server";
import style from "~/styles/routes/index.css";


export const links = () => ([
	{rel: "stylesheet", href: style},
]);

export const meta: V2_MetaFunction<typeof loader> = ({data}) => {
	return [
		{property: "description", content: "Факультет Прикладної Математики"},
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
	const {news} = useLoaderData<typeof loader>();
	const {t} = useTranslation("homepage");

	return (
		<div className='page-width'>
			<section className='main-block'>
				<div>
					<h1>{t("main.h1")}</h1>
					<p>{t("main.p")}</p>
					<Link className='button button--primary' to='/uk/about'>{t("read")}</Link>
				</div>
				<ThemedIcon path='person/1' mobileWidth={breakpoints.md} />
			</section>

			<section className='specialities-block'>
				<h2>Спеціальності</h2>
				<div className='specialities'>
					<ArticleCard
						img={<span className='card__img pi' aria-hidden={true}>π</span>}
						title='113 — Прикладна математика'
						link='/uk/about/specialities#spetsialnist-113-prykladna-matematyka'
						description='Освітня програма: “Наука про дані (Data Science) та математичне моделювання”'
						draft={false}
					/>
					<ArticleCard
						img={<span className='card__img' aria-hidden={true}>{"{ }"}</span>}
						title='121 — Інженерія програмного забезпечення'
						link='/uk/about/specialities#spetsialnist-121-inzheneriia-prohramnoho-zabezpechennia'
						description='Освітня програма: “Інженерія програмного забезпечення мультимедійних та інформаційно-пошукових систем”'
						draft={false}
					/>
					<ArticleCard
						img={<span className='card__img' aria-hidden={true}><ProcessorIcon /></span>}
						title='123 — Компʼютерна інженерія'
						link='/uk/about/specialities#spetsialnist-123-kompiuterna-inzheneriia'
						description='Освітня програма: “Системне програмування та спеціалізовані комп’ютерні системи”'
						draft={false}
					/>
				</div>
				<div>
					<Link className='button' to='/uk/about/specialities'>Детальніше</Link>
				</div>
			</section>

			<section className='news-block'>
				<h2>Новини</h2>
				<div className='news-container'>
					{news.map(n => <ArticleCard
						key={n.id}
						title={n.title}
						description={n.source}
						draft={false}
						link={`/uk/information/news/${n.id}`}
					/>)}
				</div>
				<ThemedIcon path='person/8' />

				<Link className='button button--primary' to='/uk/information/news'>Більше новин</Link>
			</section>
		</div>
	);
}


