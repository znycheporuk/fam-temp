import { isBrowser } from "~/common/constants";


interface IConfig {
	duration: number;
}

const getNotificationElement = () => {
	let notificationElement = document.getElementById("notification");
	if (!notificationElement) {
		notificationElement = document.createElement("div");
		notificationElement.id = "notification";
		notificationElement.setAttribute("popover", "auto");
		notificationElement.setAttribute("role", "alert");
		notificationElement.setAttribute("aria-live", "assertive");
		notificationElement.setAttribute("aria-atomic", "true");
		document.body.appendChild(notificationElement);
	}
	return notificationElement;
};

export const notification = {
	info: (text: string, config: IConfig = {duration: 3}) => {
		if (!isBrowser) return;
		const notificationElement = getNotificationElement();

		if (!notificationElement) return;
		notificationElement.classList.add("info");
		notificationElement.innerText = text;
		// @ts-ignore
		notificationElement.showPopover();

		setTimeout(() => {
			const notificationElement = getNotificationElement();
			notificationElement.classList.add("notification--leave");
		}, config.duration * 1000 - 300);

		setTimeout(() => {
			const notificationElement = getNotificationElement();
			// @ts-ignore
			notificationElement.hidePopover();
			notificationElement.className = "";
			notificationElement.innerText = "";
		}, config.duration * 1000);
	},
};
