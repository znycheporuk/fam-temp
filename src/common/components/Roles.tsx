import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TUser } from '~/types';


interface IRolesProps {
	user: TUser;
}

export const Roles = ({user}: IRolesProps) => {
	const {t} = useTranslation('authentication');

	const roles = useMemo(() => {
		const r = [];
		if (user.admin) r.push('admin');
		if (user.teacher) r.push('teacher');
		if (user.contentManager) r.push('contentManager');
		if (user.student) r.push('student');
		return r;
	}, [user.admin, user.contentManager, user.teacher, user.student]);

	return (
		<div className='role__container'>
			{roles.map(role => (
				<span key={role} className='role__tag'>
          {t(`roles.${role}`)}
        </span>
			))}
		</div>
	);
};
