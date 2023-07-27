import { ActionFunction, redirect, V2_MetaFunction } from "@remix-run/node";
import { Link, useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { object, string } from "yup";
import { Form, Input } from "~/common/components";
import { useMessage } from "~/common/hooks/useMessage";
import { badRequest, forbidden, isAdmin, isContentManager, langLink, notFound, parseLang } from "~/common/utils";
import { getFormDataValues } from "~/common/utils/getFormDataValues.server";
import { isSuperAdmin } from "~/common/utils/roles";
import { db } from "~/drizzle/db.server";
import { i18n } from "~/services/i18n.server";
import { commitSession, getUserSession } from "~/services/session.server";
import type { IFormContext } from "~/types";


export const meta: V2_MetaFunction = () => {
	const {t} = useTranslation("authentication");
	return [
		{title: t("signInTitle")},
		{property: "description", content: t("signInPage")},
	];
};

const validationSchema = object({
	email: string().email().required(),
	password: string().min(6).required(),
});

export const action: ActionFunction = async ({request, params}) => {
	const [errors, values] = await getFormDataValues(validationSchema, request);
	if (errors) return badRequest({errors});
	const [session, t] = await Promise.all([
		getUserSession(request),
		i18n.getFixedT(parseLang(params.lang), "server"),
	]);
	// TODO: change to .findFirst() when drizzle-orm bug is fixed
	const user = db.query.users.findMany({
		where: (u, {eq}) => eq(u.email, values.email),
		columns: {id: true, email: true, password: true, salt: true, active: true},
		with: {admin: true, teacher: true, student: true, contentManager: true},
		limit: 1,
	})[0];

	if (!user || !await Bun.password.verify(values.password + user.salt, user.password)) return notFound({
		errors: {
			email: t("invalidEmailOrPass"),
			password: t("invalidEmailOrPass"),
		},
	});
	if (!user.active) return forbidden({message: t("inactiveAccount")});

	session.set("userId", user.id);
	session.set("isAdmin", isAdmin(user));
	session.set("isSuperAdmin", isSuperAdmin(user));
	session.set("isContentManager", isContentManager(user));

	return redirect(langLink(params.lang), {headers: {"Set-Cookie": await commitSession(session)}});
};


export default () => {
	const {t} = useTranslation(["authentication", "common"]);
	const {lang} = useParams();
	useMessage();

	return (
		<div className="sign-page sign-in">
			<h1>{t("signInTitle")}</h1>
			<Form validationSchema={validationSchema}>
				{({values}: IFormContext) =>
					<>
						<Input name="email" type="email" label={t("email")} />
						<Input name="password" type="password" label={t("password")} />
						<Link to={langLink(lang, "forgot-password") + `?email=${values.email ?? ""}`} className="forgot-password">
							{t("forgotPasswordTitle")}
						</Link>
						<button className="button--primary">{t("signIn", {ns: "common"})}</button>
						<p>{t("doNotHaveAccount")} <Link to={langLink(lang, "sign-up")}>{t("signUp", {ns: "common"})}</Link></p>
					</>
				}
			</Form>
		</div>
	);
}
