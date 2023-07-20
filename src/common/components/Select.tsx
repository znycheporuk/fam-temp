import { HTMLProps, ReactElement, useEffect } from "react";
import { useFormContext } from "~/common/hooks";
import { toKebabCase } from "~/common/utils";


interface IProps extends HTMLProps<HTMLSelectElement> {
	name: string;
	label?: string;
	children: ReactElement[];
}

const Select = ({name, label, children, defaultValue, ...props}: IProps) => {
	const context = useFormContext();
	// checks are needed to use component without FormContext
	const {getFieldMeta, setValue, setTouched} = context ?? {};
	const {error, value, touched, forceDisplay} = getFieldMeta?.(name) ?? {};

	const onChange = (e: any) => {
		setValue(name, e.target.value);
		!touched && setTouched?.(name);
	};

	useEffect(() => {
		setValue(name, defaultValue ?? children[0]?.props.value);
	}, []);

	const id = toKebabCase(name);
	return (
		<label className="grid">
			{label}
			<select
				{...props}
				defaultValue={defaultValue}
				value={value ?? ""}
				name={name}
				onChange={onChange}
				aria-describedby={error ? `${id}-error` : undefined}
			>
				{children}
			</select>
			{error && (touched || forceDisplay) && <em id={`${id}-error`} className="validation-error">{error}</em>}
		</label>
	);
};

interface IOptionProps extends HTMLProps<HTMLOptionElement> {

}

Select.Option = ({children, ...props}: IOptionProps) => {
	return (
		<option {...props}>
			{children}
		</option>
	);
};

export { Select };
