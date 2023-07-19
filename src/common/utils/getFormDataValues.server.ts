import type { Schema, ValidationError } from "yup";
import { getValidationErrors } from "~/common/utils";


export const getFormDataValues = async <T>(
	validationSchema: Schema<T>,
	request: Request,
): Promise<[undefined, Schema<T>["__outputType"]] | [Record<string, string>, undefined]> => {
	const formData = await request.formData();
	try {
		const values = await validationSchema.validate(Object.fromEntries(formData), {
			abortEarly: false,
			stripUnknown: true,
		});
		return [undefined, values];
	} catch (err) {
		return [getValidationErrors(err as ValidationError), undefined];
	}
};
