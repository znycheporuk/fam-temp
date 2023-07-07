import Notification from 'rc-notification';
import type { NotificationInstance } from 'rc-notification/es/Notification';
import { isBrowser } from '~/common/constants';


let notificationInstance: NotificationInstance;

if (isBrowser) {
	Notification.newInstance({maxCount: 5}, notification => notificationInstance = notification);
}

interface IConfig {
	duration: number;
}


export const message = {
	info: (text: string, config: IConfig = {duration: 3}) => {
		if (!isBrowser) return;

		notificationInstance.notice({
			...config,
			content: (
				<div role='alert'>
					{text}
				</div>
			),
		});
	},
};
