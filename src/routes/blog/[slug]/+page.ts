import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`$lib/posts/${params.slug}.md`)
		return {
			content: post.default,
			metadata: post.metadata
		};
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		error(404, `Could not find ${params.slug}`)
	}
} 
