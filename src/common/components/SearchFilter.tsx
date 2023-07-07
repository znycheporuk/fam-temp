import { useLocation, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';


interface ISearchFilterProps {
	filterOptions?: Record<string, string>;
}

export const SearchFilter = ({filterOptions}: ISearchFilterProps) => {
	const {pathname, search: sString} = useLocation();
	const navigate = useNavigate();
	const {t} = useTranslation('common');

	const params = new URLSearchParams(sString);

	const search = params.get('search') ?? '';
	const filter = params.get('filter') ?? '';
	const size = Number(params.get('size') ?? 10);

	const onChange = (name: string, value: string) => {
		if (!value) {
			params.delete(name);
		} else {
			params.set(name, value);
		}
		navigate(`${pathname}?${params.toString()}`);
	};

	return (
		<div className='search-bar'>
			<input value={search} placeholder={t('search')} onChange={(e) => onChange('search', e.target.value)} />
			{filterOptions && (
				<select value={filter} onChange={(e) => onChange('filter', e.target.value)}>
					{Object.entries(filterOptions).map(([value, label]) => (
						<option key={value} value={value}>{label}</option>
					))}
				</select>
			)}
			<select value={size} onChange={(e) => onChange('size', e.target.value)}>
				<option>10</option>
				<option>20</option>
				<option>50</option>
				<option>100</option>
			</select>
		</div>
	);
};
