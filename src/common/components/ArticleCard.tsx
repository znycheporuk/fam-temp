import { Link, useLocation } from "@remix-run/react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { isBrowser } from "~/common/constants";
import { useRootLoaderData } from "~/common/hooks";
import { isContentManager } from "~/common/utils";


interface IProps {
	title: string;
	description: string;
	link: string;
	draft: boolean;
	img?: ReactNode;
}

export const ArticleCard = ({title, description, link, draft, img}: IProps) => {
	const {pathname} = useLocation();
	const {user} = useRootLoaderData();
	const {t} = useTranslation("admin");

	return (
		<article className="card">
			{img}
			<h3 className="card__title">
				<Link to={link} className="card__link" aria-current={pathname === link && "page"}>
					{title}
				</Link>
			</h3>
			<p className="card__description">{description}</p>
			{isBrowser && (!img) && isContentManager(user) &&
				<Link className="link--edit" to={`${link}/edit`}>{t("edit")}</Link>}
			{isContentManager(user) && draft && <span className="card__draft"><div>{t("draft")}</div></span>}
		</article>
	);
};
