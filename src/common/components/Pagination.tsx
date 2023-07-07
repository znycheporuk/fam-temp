import { useLocation, useNavigate } from '@remix-run/react';
import { ArrowIcon } from '~/common/components/Icons';


interface IPaginationProps {
	total: number;
}

export const Pagination = ({total}: IPaginationProps) => {
	const {pathname, search} = useLocation();
	const navigate = useNavigate();
	const params = new URLSearchParams(search);

	const page = Number(params.get('page') ?? 1);
	const size = Number(params.get('size') ?? 10);
	const numOfPages = Math.ceil(total / +size);

	const setPage = (p: number | string) => {
		params.set('page', String(p));
		navigate(`${pathname}?${params.toString()}`);
	};

	return (
		<div className='pagination'>
			<button className='arrow-button' disabled={page <= 1} onClick={() => setPage(page - 1)}>
				<ArrowIcon direction='left' />
			</button>
			<input type='number' value={page} onChange={(e) => setPage(e.target.value)} /> / {numOfPages}
			<button className='arrow-button' disabled={page >= numOfPages} onClick={() => setPage(page + 1)}>
				<ArrowIcon direction='right' />
			</button>
		</div>
	);
};
