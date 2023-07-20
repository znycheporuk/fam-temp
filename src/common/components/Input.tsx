import type { HTMLProps } from "react";
import { useFormContext } from "~/common/hooks";
import { toKebabCase } from "~/common/utils";


interface IProps extends HTMLProps<HTMLInputElement> {
	name: string;
	label?: string;
	labelStyle?: Record<string, string>;
}

export const Input = ({label, name, labelStyle, ...props}: IProps) => {
	const context = useFormContext();
	const {getFieldMeta, setValue, setTouched} = context ?? {};
	const {error, touched, forceDisplay, defaultValue} = getFieldMeta?.(name) ?? {};

	const onChange = (e: any) => {
		props.onChange?.(e);
		setValue?.(name, e.target.value);
	};

	const id = toKebabCase(name);

	return (
		<label className="grid" style={labelStyle}>
			{label}
			<input
				{...props}
				id={id}
				name={name}
				defaultValue={defaultValue as string | undefined}
				onChange={onChange}
				onBlur={() => !touched && setTouched?.(name)}
				aria-invalid={!!error}
				aria-describedby={error ? `${id}-error` : undefined}
			/>
			{error && (touched || forceDisplay) && <em id={`${id}-error`} className="validation-error">{error}</em>}
		</label>
	);
};

