import { useActionData } from "@remix-run/react";
import { useEffect } from "react";


export const useMessage = () => {
	const data = useActionData();
	useEffect(() => {
		if (data?.message) {
			alert(data.message)
		}
	}, [data?.message]);
};
