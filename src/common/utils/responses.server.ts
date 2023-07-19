import { json } from "@remix-run/node";


export const badRequest = <T>(body?: T) => json(body, {status: 400});
export const unauthorized = <T>(body?: T) => json(body, {status: 401});
export const forbidden = <T>(body?: T) => json(body, {status: 403});
export const notFound = <T>(body?: T) => json(body, {status: 404});
