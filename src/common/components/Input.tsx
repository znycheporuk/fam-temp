import type { HTMLProps } from 'react';
import { useFormikContext } from '~/common/hooks';


interface IProps extends HTMLProps<HTMLInputElement> {
	name: string;
	label?: string;
	labelStyle?: Record<string, string>;
}

export const Input = ({label, name, labelStyle, ...props}: IProps) => {
	const {getFieldMeta, setValue, setTouched} = useFormikContext();
	const {error, value, touched, forceDisplay} = getFieldMeta(name);

	const onChange = (e: any) => {
		props.onChange?.(e);
		setValue(name, e.target.value);
	};

	return (
		<label className='grid' style={labelStyle}>
			{label}
			<input
				name={name} {...props}
				onChange={onChange}
				onBlur={() => !touched && setTouched(name)}
				value={value ?? ''}
				aria-invalid={!!error}
			/>
			{error && (touched || forceDisplay) && <em className='validation-error'>{error}</em>}
		</label>
	);
};

