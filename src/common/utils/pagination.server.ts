export const pagination = (params: URLSearchParams, total: number) => {
	let page = Number(params.get("page") || 1);
	let size = Number(params.get("size") || 10);
	let toRedirect = false;

	if ((size < 1) || (size > 100)) {
		params.set("size", "10");
		size = 10;
		toRedirect = true;
	}
	const numOfPages = Math.ceil(total / +size);
	if ((page < 1) && numOfPages >= 1) {
		params.set("page", "1");
		page = 1;
		toRedirect = true;
	} else if (page > numOfPages && numOfPages !== 0) {
		params.set("page", String(numOfPages));
		page = numOfPages;
		toRedirect = true;
	}
	if (toRedirect) return {toRedirect};

	return {
		take: size,
		skip: (page - 1) * size,
	};
};
