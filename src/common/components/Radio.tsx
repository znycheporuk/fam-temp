import { cloneElement, HTMLProps, ReactElement } from 'react';
import { useFormikContext } from '~/common/hooks';
import { cx } from '~/common/utils';


interface IProps {
	children: ReactElement[];
	name: string;
	label?: string;
}

const Radio = ({children, label, name}: IProps) => {
	const {getFieldMeta, setValue, setTouched} = useFormikContext();
	const {error, value, touched, forceDisplay} = getFieldMeta(name);

	return (
		<div className='radio-container' onClick={() => !touched && setTouched(name)}>
			{label && <p>{label}</p>}
			{children.map(child => cloneElement(child, {
				key: child.props.value,
				name,
				currentValue: value,
				setValue: () => setValue(name, child.props.value),
			}))}
			{error && (touched || forceDisplay) && <><br /> <em className='validation-error'>{error}</em></>}
		</div>
	);
};

interface IOptionProps extends HTMLProps<HTMLInputElement> {
	label?: string,
	value: string | number
	// provided by parent Radio
	name?: string
	setValue?: (value: string | number) => void
	currentValue?: string | number
}

Radio.Option = ({label, value, name, onChange, setValue, currentValue, className, ...props}: IOptionProps) => {

	const handleChange = (e: any) => {
		onChange?.(e);
		setValue?.(value);
	};

	return (
		<label className='radio__option-container'>
			<input
				{...props}
				type='radio'
				className={cx('radio__input', className)}
				value={value}
				name={name}
				onChange={handleChange}
				checked={value === currentValue}
			/>
			<span className='radio__option--marker' />
			<span className='radio__option' />
			{label}
		</label>
	);
};


export { Radio };
