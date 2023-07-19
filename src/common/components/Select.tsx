import { HTMLProps, ReactElement, useEffect } from "react";
import { useFormContext } from "~/common/hooks";


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

	return (
		<label className="grid">
			{label}
			<select defaultValue={value} value={value ?? ""} {...props} name={name} onChange={onChange}>
				{children}
			</select>
			{error && (touched || forceDisplay) && <em className="validation-error">{error}</em>}
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
