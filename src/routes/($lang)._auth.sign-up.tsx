import type { Prisma } from "@prisma/client";
import { ActionFunction, json, redirect, V2_MetaFunction } from "@remix-run/node";
import { Link, useActionData, useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { boolean, mixed, object, string } from "yup";
import { Form, Input, Select } from "~/common/components";
import { badRequest, generateString, langLink } from "~/common/utils";
import { getFormDataValues } from "~/common/utils/getFormDataValues.server";
import { db } from "~/services/db.server";
import { commitSession, getUserSession } from "~/services/session.server";
import type { IFormContext } from "~/types";


export const meta: V2_MetaFunction = () => {
	const {t} = useTranslation("authentication");
	return [
		{title: t("signUpTitle")},
		{property: "description", content: t("signUpPage")},
	];
};

const validationSchema = object({
	email: string().email().required(),
	password: string().min(6).required(),
	firstName: string().required(),
	lastName: string().required(),
	role: mixed().oneOf(["student", "teacher", "admin", "contentManager"]),
	group: string().when("role", {
		is: (value: string) => value === "student",
		then: (schema) => schema.required(),
	}),
	superAdmin: boolean().transform(value => typeof value === "boolean" ? value : value === "on"),
});

export const action: ActionFunction = async ({request, params}) => {
	const [errors, data] = await getFormDataValues(validationSchema, request);
	if (errors) return badRequest({errors});
	const {role, group, superAdmin, ...values} = data;

	const session = await getUserSession(request);

	const user = await db.user.findFirst({where: {email: values.email}});
	if (user) return json({errors: {email: "User with such email already exists"}}, {status: 409});

	const salt = generateString(4);
	values.password = await Bun.password.hash(values.password + salt);

	let roleSpecificData;
	switch (role) {
		case "admin":
			roleSpecificData = {admin: {create: {superAdmin}}};
			break;
		case "contentManager":
			roleSpecificData = {contentManager: {create: {}}};
			break;
		case "teacher":
			roleSpecificData = {teacher: {create: {}}};
			break;
		case "student":
			roleSpecificData = {student: {create: {group}}};
			break;
		default:
			return badRequest("invalid user type");
	}
	await db.user.create({
		data: {...values as Prisma.UserCreateInput, salt, ...roleSpecificData as any},
		include: {admin: true, contentManager: true},
	});
	return redirect(langLink(params.lang), {headers: {"Set-Cookie": await commitSession(session)}});
};


export default () => {
	const {t} = useTranslation(["authentication", "common"]);
	const actionData = useActionData();
	const {lang} = useParams();

	return (
		<div className="sign-page sign-up">
			<h1>{t("signUpTitle")}</h1>
			<Form validationSchema={validationSchema} errors={actionData?.errors}>
				{({values}: IFormContext) =>
					<>
						<Input name="firstName" label={t("firstName")} />
						<Input name="lastName" label={t("lastName")} />
						<Select name="role" label={t("role")}>
							<Select.Option value="student" label={t("roles.student")} />
							<Select.Option value="teacher" label={t("roles.teacher")} />
							<Select.Option value="contentManager" label={t("roles.contentManager")} />
							<Select.Option value="admin" label={t("roles.admin")} />
						</Select>
						{values.role === "student" && <Input name="group" label={t("group")} />}
						<Input name="email" type="email" label={t("email")} />
						<Input name="password" type="password" label={t("password")} />
						<button type="submit" className="button--primary">{t("signUp", {ns: "common"})}</button>
						<p>{t("alreadyHaveAccount")} <Link to={langLink(lang, "sign-in")}>{t("signIn", {ns: "common"})}</Link></p>
					</>
				}
			</Form>
		</div>
	);
}
