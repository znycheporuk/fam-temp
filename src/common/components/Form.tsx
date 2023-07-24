import { Form as RemixForm, useActionData } from "@remix-run/react";
import { useMemo } from "react";
import type { FormProps } from "react-router-dom";
import type { Schema } from "yup";
import { FormContextWrapper } from "~/common/components";


interface IFormProps extends FormProps {
	validationSchema: Schema<any>;
	initialValues?: Record<string, any>;
	children: any;
}

export const Form = ({children, validationSchema, initialValues, method = "POST", ...props}: IFormProps) => {
	const actionData = useActionData();
	const errors = useMemo(() => actionData?.errors, [actionData?.errors]);
	
	return (
		<RemixForm {...props} method={method}>
			<FormContextWrapper validationSchema={validationSchema} initialValues={initialValues} errors={errors}>
				{children}
			</FormContextWrapper>
		</RemixForm>
	);
};
