declare module '*.md' {
	import type { SvelteComponent } from 'svelte';

	export interface Metadata {
		title: string;
		description?: string;
		date?: string;
		categories?: string[];
		published?: boolean;
	}

	export const metadata: Metadata;
	export default class MarkdownComponent extends SvelteComponent { }
}

