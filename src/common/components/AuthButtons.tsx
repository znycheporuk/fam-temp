import { Form, Link, useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useRootLoaderData } from "~/common/hooks";
import { isAdmin, langLink } from "~/common/utils";


export const AuthButtons = () => {
	const {user} = useRootLoaderData();
	const {t} = useTranslation(["common", "admin"]);
	const {lang} = useParams();

	return (
		<div className="auth-buttons">
			{user ? (<>
				<Form method="POST" action={langLink(lang, "sign-out")}>
					<button>{t("signOut")}</button>
				</Form>
				{isAdmin(user) && <Link className="button" to={langLink(lang, "users")}>{t("users", {ns: "admin"})}</Link>}
			</>) : (
				<Link to={langLink(lang, "sign-in")}>{t("signIn")}</Link>
			)}
		</div>
	);
};
