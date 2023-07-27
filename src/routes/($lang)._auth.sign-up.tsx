import { ActionFunction, json, redirect, V2_MetaFunction } from "@remix-run/node";
import { Link, useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { boolean, mixed, object, string } from "yup";
import { Form, Input, Select } from "~/common/components";
import { badRequest, generateSalt, langLink } from "~/common/utils";
import { getFormDataValues } from "~/common/utils/getFormDataValues.server";
import { db } from "~/drizzle/db.server";
import { admins, contentManagers, students, teachers, users } from "~/drizzle/schema.server";
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

	const user = db.query.users.findMany({where: (user, {eq}) => eq(user.email, values.email), limit: 1})[0];
	if (user) return json({errors: {email: "User with such email already exists"}}, {status: 409});

	const salt = generateSalt();
	values.password = await Bun.password.hash(values.password + salt);

	const res = db.insert(users).values({...values, salt}).returning({userId: users.id}).all()[0];
	const userId = res?.userId as number;
	session.set("userId", userId);
	switch (role) {
		case "admin":
			db.insert(admins).values({userId}).run();
			session.set("isAdmin", true);
			session.set("isContentManager", true);
			break;
		case "contentManager":
			db.insert(contentManagers).values({userId}).run();
			session.set("isContentManager", true);
			break;
		case "student":
			db.insert(students).values({userId, group: group as string}).run();
			break;
		case "teacher":
			db.insert(teachers).values({userId}).run();
			session.set("isTeacher", true);
			break;
	}
	return redirect(langLink(params.lang), {headers: {"Set-Cookie": await commitSession(session)}});
};


export default () => {
	const {t} = useTranslation(["authentication", "common"]);
	const {lang} = useParams();

	return (
		<div className="sign-page sign-up">
			<h1>{t("signUpTitle")}</h1>
			<Form validationSchema={validationSchema}>
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
