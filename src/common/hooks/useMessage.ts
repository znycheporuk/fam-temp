import { useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { notification } from "~/common/utils";


/** Show a message returned from action */
export const useMessage = () => {
	const data = useActionData();

	useEffect(() => {
		if (data?.message) {
			notification.info(data.message);
		}
	}, [data?.message]);
};
