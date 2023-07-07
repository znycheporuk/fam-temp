import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { bundleMDX } from 'mdx-bundler';
import { getMDXComponent } from 'mdx-bundler/client';
import { renderToStaticMarkup } from 'react-dom/server';


export const getHTMLFromSource = async (source: string) => {
	const xdmOptions = await getXDMOptions();

	const {code} = await bundleMDX({source, xdmOptions});
	const Component = getMDXComponent(code);

	return renderToStaticMarkup(<Component />);
};

const getXDMOptions = async () => {
	const {default: gfm} = await import('remark-gfm');
	const {visit} = await import('unist-util-visit');

	return (options: any) => {
		options.remarkPlugins = [
			...(options.remarkPlugins ?? []),
			gfm,

			// add attributes to links
			[() => (tree: any) => {
				visit(tree, 'link', (node) => {
					const data = node.data || (node.data = {});
					const props = data.hProperties || (data.hProperties = {});
					Object.assign(props, {target: '_blank', rel: ['nofollow', 'noreferrer', 'noopener']});
				});
			}],

			// adds english ids to each header
			[() => (tree: any) => {
				visit(tree, 'heading', (node) => {
					const data = node.data || (node.data = {});
					const props = data.hProperties || (data.hProperties = {});
					let id = props.id;
					if (!id) {
						const text = node.children.find((child: any) => child.type === 'text').value.toLowerCase();
						id = CyrillicToTranslit({preset: 'uk'}).transform(text, '-');
					}
					id = id.replace(/[^a-zA-Z\d-]/g, '');
					data.id = id;
					props.id = id;
				});
			}],

			// wrap header text with link
			[() => (tree: any) => {
				visit(tree, 'heading', (node) => {
					node.children = [{
						type: 'link',
						url: `#${node.data.id}`,
						children: node.children,
					}];
				});
			}],

			// wrap tables with div
			[() => (tree: any) => {
				visit(tree, 'table', (node) => {
					if (!node.wrapped) {
						Object.assign(node, {
							type: 'mdxJsxFlowElement',
							name: 'div',
							children: [{...node, wrapped: true}],
							attributes: [
								{
									type: 'mdxJsxAttribute',
									name: 'className',
									value: 'table__wrapper',
								},
							],
						});
					}
				});

				visit(tree, 'mdxJsxFlowElement', (node) => {
					if (node.name === 'table') {
						if (!node.wrapped) {
							Object.assign(node, {
								type: 'mdxJsxFlowElement',
								name: 'div',
								children: [{...node, wrapped: true}],
								attributes: [
									{
										type: 'mdxJsxAttribute',
										name: 'className',
										value: 'table__wrapper',
									},
								],
							});
						}
					}
				});
			}],

		];

		return options;
	};
};
