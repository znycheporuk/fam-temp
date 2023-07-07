import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Logo } from "~/common/components";
import { FacebookIcon, TelegramIcon } from "~/common/components/Icons";
import { useRootLoaderData } from "~/common/hooks";


export const Footer = () => {
	const {lang} = useRootLoaderData();
	const {t} = useTranslation("common");

	return (
		<footer className='footer'>
			<div className='page-width footer__content'>
				<Logo />
				<div className='footer__links-1'>
					<Link to={`/${lang}/admission/contacts`}>{t("footer.contacts")}</Link>
					<Link to={`/${lang}/404`}>{t("footer.dean'sReport")}</Link>
					<a href='/files/Opituvannya_NPP_121.pdf' target='_blank'>{t("footer.surveyOfWorkers")}</a>
				</div>
				<div className='footer__links-2'>
					<a
						href='/files/Opituvannya_aspirantiv_121.pdf'
						target='_blank'
					>{t("footer.surveyOfGraduates")}</a>
					<a href='/files/Kuratory_21-22.pdf' target='_blank'>{t("footer.curators")}</a>
					<a
						href={lang === "en" ? "https://kpi.ua/en/code" : "https://kpi.ua/code"}
						target='_blank'
					>
						{t("footer.codeOfHonor")}
					</a>
				</div>
				<div className='social'>
					<a href='https://t.me/dekanat_fpm' target='_blank' aria-label={t("footer.telegram")}>
						<TelegramIcon />
					</a>
					<a
						href='https://www.facebook.com/groups/fpm.kpi/' target='_blank'
						aria-label={t("footer.facebook")}
					>
						<FacebookIcon />
					</a>
				</div>
				<p className='copyright'>{t("footer.copyrights")}</p>
			</div>
		</footer>
	);
};
