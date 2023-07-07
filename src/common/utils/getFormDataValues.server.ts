import type { ValidationError } from 'yup';
import type { AssertsShape, ObjectShape, OptionalObjectSchema } from 'yup/lib/object';
import { getValidationErrors } from '~/common/utils';


export const getFormDataValues = async <T extends ObjectShape>(
	validationSchema: OptionalObjectSchema<T>,
	request: Request,
): Promise<[undefined, AssertsShape<T>] | [Record<string, string>, undefined]> => {
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
