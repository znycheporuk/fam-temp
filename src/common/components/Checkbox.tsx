import type { HTMLProps } from 'react';
import { useFormikContext } from '~/common/hooks';
import { cx } from '~/common/utils';


interface IProps extends HTMLProps<HTMLInputElement> {
	name: string;
	label?: string;
}

export const Checkbox = ({label, name, className, ...props}: IProps) => {
	const {getFieldMeta, setValue, setTouched} = useFormikContext();
	const {error, value, touched, forceDisplay} = getFieldMeta(name);

	const onChange = (e: any) => {
		props.onChange?.(e);
		setValue(name, e.target.checked);
		!touched && setTouched(name);
	};

	return (
		<label className='check'>
			<input
				name={name}
				className={cx('check__input', className)}
				{...props}
				type='checkbox'
				checked={value}
				onChange={onChange}
				aria-invalid={!!error}
			/>
			<svg className='check__box' viewBox='0 0 15 15'>
				<polyline className='check__mark' points='2.5 7 6.5 11 12.5 4' />
			</svg>
			{label}
			{error && (touched || forceDisplay) && <><br /> <em className='validation-error'>{error}</em></>}
		</label>
	);
};
