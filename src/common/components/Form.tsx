import { Form as RemixForm } from "@remix-run/react";
import type { FormProps } from "react-router-dom";
import type { Schema } from "yup";
import { FormContextWrapper } from "~/common/components";


interface IFormProps extends FormProps {
	validationSchema: Schema<any>;
	initialValues?: Record<string, any>;
	errors?: Record<string, string>;
	children: any;
}

export const Form = ({children, validationSchema, initialValues, errors, method = "POST", ...props}: IFormProps) => {
	return (
		<RemixForm {...props} method={method}>
			<FormContextWrapper validationSchema={validationSchema} initialValues={initialValues} errors={errors}>
				{children}
			</FormContextWrapper>
		</RemixForm>
	);
};
