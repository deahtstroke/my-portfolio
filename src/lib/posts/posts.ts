import type { Post } from "$lib/types/Post";

export default function getPosts(): Post[] {
	const posts: Post[] = [];
	const paths = import.meta.glob("../../lib/posts/*.md", { eager: true })

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split("/").at(-1)?.replace('.md', '')
		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = { ...metadata, slug } satisfies Post;
			if (post.published) {
				posts.push(post)
			}
		}
	}

	posts.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime()
	})

	return posts
}


