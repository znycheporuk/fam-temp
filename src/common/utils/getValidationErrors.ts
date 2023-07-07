import type { ValidationError } from 'yup';


export const getValidationErrors = (error: ValidationError): Record<string, string> => {
	return error.inner.reduce((prev, curr) => ({
		...prev,
		[curr.path!]: curr.message,
	}), {});
};
