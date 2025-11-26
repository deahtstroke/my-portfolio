import type { PageLoad } from "./$types";
import getPosts from "$lib/posts/posts"

export const load: PageLoad = () => {
	return { posts: getPosts() }
}

export const ssr = false;
