import { ActionFunction, json, V2_MetaFunction } from "@remix-run/node";
import { useActionData, useLocation } from "@remix-run/react";
import { lt } from "drizzle-orm";
import { useTranslation } from "react-i18next";
import { object, string } from "yup";
import { Form, Input } from "~/common/components";
import { getResetPasswordTemplate } from "~/common/emailTemplates/resetPassword";
import { badRequest, generateString, getFormDataValues, notFound, parseLang, sendEmail } from "~/common/utils";
import { db } from "~/drizzle/db.server";
import { resetTokens } from "~/drizzle/schema.server";
import { i18n } from "~/services/i18n.server";


export const meta: V2_MetaFunction = () => {
	const {t} = useTranslation("authentication");
	return [
		{title: t("forgotPasswordTitle")},
		{property: "description", content: t("forgotPasswordPage")},
	];
};

const validationSchema = object({
	email: string().email().required(),
});

export const action: ActionFunction = async ({request, params}) => {
	const [error, values] = await getFormDataValues(validationSchema, request);
	if (error) return badRequest({error});


	let token = generateString(32);

	const [t, user, hashedToken] = await Promise.all([
		i18n.getFixedT(params.lang!, "server"),
		db.query.users.findFirst({
			where: (user, {eq}) => eq(user.email, values.email),
			columns: {
				id: true,
				firstName: true,
			},
		}),
		Bun.password.hash(token),
	]);

	if (!user) return notFound({message: t("userNotFound")});
	
	const expiresAt = Date.now() + 15 * 60 * 1000;
	await Promise.all([
		db.insert(resetTokens)
			.values({token, userId: user.id, expiresAt})
			.onConflictDoUpdate({target: resetTokens.userId, set: {token, expiresAt}}).run(),

		sendEmail({
			to: values.email,
			subject: t("resetPassword"),
			html: getResetPasswordTemplate(parseLang(params.lang), {
				firstName: user.firstName,
				userId: user.id,
				token: encodeURIComponent(hashedToken),
			}),
		}),

		db.delete(resetTokens).where(lt(resetTokens.expiresAt, Date.now())).run(),
	]);
	// console.log(`/reset-password?token=${encodeURIComponent(hashedToken)}&userId=${user.id}`);
	return json({message: t("letterOfConfirmationSent")});
};


export default () => {
	const {t} = useTranslation("authentication");
	const actionData = useActionData();
	const {search} = useLocation();
	const email = new URLSearchParams(search).get("email");

	return (
		<div className="sign-page sign-in">
			<h1>{t("forgotPasswordTitle")}</h1>
			<Form validationSchema={validationSchema} errors={actionData?.errors} initialValues={{email}}>
				<Input name="email" type="email" label={t("email")} />
				<button type="submit" className="button--primary">
					{t("forgotPasswordBtn")}
				</button>
			</Form>
		</div>
	);
}
