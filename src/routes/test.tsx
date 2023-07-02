import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";


export const action = async ({request}: ActionArgs) => {
	return null;
};
export const loader = () => {
	return {message: "Hello World"};
};
export const meta: V2_MetaFunction = () => {
	return [
		{title: "New Remix App"},
		{name: "description", content: "Welcome to Remix!"},
	];
};


export default function Index() {
	return (
		<div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.8"}}>
			<Form action='?_method=PUT' method='POST'>
				<input type='text' name='name' />
			</Form>
			<Link to='/'>asdasd</Link>
		</div>
	);
}
