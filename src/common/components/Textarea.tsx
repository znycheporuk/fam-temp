import type { HTMLProps } from "react";
import { useFormContext } from "~/common/hooks";


interface IProps extends HTMLProps<HTMLTextAreaElement> {
	name: string;
	label?: string;
	labelStyle?: Record<string, string>;
}

export const Textarea = ({label, name, labelStyle, ...props}: IProps) => {
	const context = useFormContext();
	const {getFieldMeta, setValue, setTouched} = context ?? {};
	const {error, touched, forceDisplay, defaultValue} = getFieldMeta?.(name) ?? {};

	const onChange = (e: any) => {
		props.onChange?.(e);
		setValue?.(name, e.target.value);
	};

	return (
		<label className="grid" style={labelStyle}>
			{label}
			<textarea
				name={name} {...props}
				onChange={onChange}
				onBlur={() => !touched && setTouched(name)}
				defaultValue={defaultValue as string | undefined}
				aria-invalid={!!error}
			/>
			{error && (touched || forceDisplay) && <em className="validation-error">{error}</em>}
		</label>
	);
};
