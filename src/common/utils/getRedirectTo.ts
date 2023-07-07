export const getRedirectTo = (request: Request) => new URL(request.url).searchParams.get('redirectTo')
	|| request.headers.get('Referer')
	|| '/';
