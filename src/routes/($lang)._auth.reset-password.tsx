import { ActionFunction, redirect, V2_MetaFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useTranslation } from "react-i18next";
import { object, string } from "yup";
import { Form, Input } from "~/common/components";
import { badRequest, generateSalt, getFormDataValues, langLink } from "~/common/utils";
import { db } from "~/drizzle/db.server";
import { resetTokens, users } from "~/drizzle/schema.server";
import { i18n } from "~/services/i18n.server";


export const meta: V2_MetaFunction = () => {
	const {t} = useTranslation("authentication");
	return [
		{title: t("resetPasswordTitle")},
		{property: "description", content: t("resetPasswordPage")},
	];
};

const validationSchema = object({
	password: string().min(6).required(),
});

export const action: ActionFunction = async ({request, params}) => {
	const [error, values] = await getFormDataValues(validationSchema, request);
	if (error) return badRequest({error});

	const searchParams = new URL(request.url).searchParams;
	const token = searchParams.get("token");
	const userId = searchParams.get("userId");
	const t = await i18n.getFixedT(params.lang!, "server");

	if (!token || !userId) return badRequest({message: t("invalidParams")});

	const user = await db.query.users.findFirst({
		where: (user, {eq}) => eq(user.id, Number(userId)),
		with: {resetToken: true},
	});
	if (!user || !user.resetToken) return badRequest({message: t("invalidParams")});

	const matches = await Bun.password.verify(user.resetToken.token, decodeURIComponent(token));
	const expired = user.resetToken.expiresAt < Date.now();
	if (!matches || expired) return badRequest({message: t("invalidParams")});

	const salt = generateSalt();
	const hashedPassword = await Bun.password.hash(values.password + salt);

	await Promise.all([
		db.update(users).set({password: hashedPassword, salt}).where(eq(users.id, user.id)).run(),
		db.delete(resetTokens).where(eq(resetTokens.userId, user.id)).run(),
	]);
	return redirect(langLink(params.lang, "sign-in"));
};


export default () => {
	const {t} = useTranslation("authentication");
	const actionData = useActionData();

	return (
		<div className="sign-page sign-up">
			<h1>{t("resetPasswordTitle")}</h1>
			<Form validationSchema={validationSchema} errors={actionData?.errors}>
				<Input name="password" type="password" label={t("newPassword")} />
				<button type="submit" className="button--primary">{t("resetPasswordBtn")}</button>
			</Form>
		</div>
	);
}
