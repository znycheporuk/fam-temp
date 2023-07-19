import { Link, useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { langLink } from "~/common/utils";


export const Logo = () => {
	const {t} = useTranslation();
	const {lang} = useParams();

	return (
		<Link to={langLink(lang)} className="logo" aria-label={t("aria.logo")}>
			{t("FPM")}
		</Link>
	);
};
