import { ActionFunction, redirect, V2_MetaFunction } from "@remix-run/node";
import { Link, useActionData, useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { object, string } from "yup";
import { Form, Input } from "~/common/components";
import { badRequest, forbidden, isAdmin, isContentManager, langLink, notFound } from "~/common/utils";
import { getFormDataValues } from "~/common/utils/getFormDataValues.server";
import { isSuperAdmin } from "~/common/utils/roles";
import { db } from "~/services/db.server";
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
	const [error, values] = await getFormDataValues(validationSchema, request);
	if (error) return badRequest({error});
	const [session, user, t] = await Promise.all([
		getUserSession(request),

		db.user.findUnique({
			where: {email: values.email},
			include: {admin: true, teacher: true, student: true, contentManager: true},
		}),

		i18n.getFixedT(params.lang!, "server"),
	]);

	if (!user) return notFound({message: t("invalidEmailOrPass")});

	const matches = await Bun.password.verify(values.password + user.salt, user.password);

	if (!matches) return notFound({message: t("invalidEmailOrPass")});
	if (!user.active) return forbidden({message: t("inactiveAccount")});

	session.set("userId", user.id);
	session.set("isAdmin", isAdmin(user));
	session.set("isSuperAdmin", isSuperAdmin(user));
	session.set("isContentManager", isContentManager(user));

	return redirect(langLink(params.lang), {headers: {"Set-Cookie": await commitSession(session)}});
};


export default () => {
	const {t} = useTranslation(["authentication", "common"]);
	const actionData = useActionData();
	const {lang} = useParams();

	return (
		<div className="sign-page sign-in">
			<h1>{t("signInTitle")}</h1>
			<Form validationSchema={validationSchema} errors={actionData?.errors}>
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
