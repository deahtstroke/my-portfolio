<script lang="ts">
	import HeaderTitle from "$lib/components/HeaderTitle.svelte";
	import { fadeFly } from "$lib/transitions/transitions";
	import { formatDate } from "$lib/utils/date";
	import type { PageProps } from "./$types";
	import { stagger } from "$lib/utils/staggeredCount";

	let { data }: PageProps = $props();

	const DESC_LIMIT: number = 100;

	function trimDescription(description: string): string {
		if (description.length > DESC_LIMIT) {
			let shortened: string = description.slice(0, DESC_LIMIT);
			for (let i = shortened.length - 1; i > 0; i--) {
				if (shortened.charAt(i) == " ") {
					shortened = shortened.slice(0, i).concat("...");
					break;
				}
			}
			return shortened;
		}
		return description;
	}
</script>

<HeaderTitle
	title="Blog"
	description="Technical writing and software development insights"
/>

<main
	class="flex flex-col items-center justify-center gap-10 sm:gap-18 md:gap-24"
>
	<section class="max-w-6xl relative px-8 flex flex-col gap-6 items-center">
		<h1
			in:fadeFly={{ delay: stagger(false, 1), duration: 300, y: 20 }}
			class="text-5xl text-bright font-semibold"
		>
			Blog
		</h1>
		<p
			in:fadeFly={{ delay: stagger(false, 1), duration: 300, y: 20 }}
			class="text-center"
		>
			Technical writing and development insights (AKA professional rambling)
		</p>
		<div class="grid gap-6">
			{#each data.posts as post}
				<a href="/blog/{post.slug}">
					<article
						class="flex flex-col sm:flex-row gap-6 sm:items-center"
						in:fadeFly|global={{
							delay: stagger(true, 1),
							duration: 300,
							y: 20,
						}}
					>
						<!-- Thumbnail -->
						<div class="sm:w-48 sm:h-36 shrink-0">
							<div
								class="w-full h-36 rounded-lg overflow-hidden bg-linear-to-br from-primary/20 to-accent/20
							flex items-center justify-center border border-border
							group-hover:border-primary/50 transition-colors font-mono"
								style="background: linear-gradient(135deg, hsl({post.colorStart}), hsl({post.colorEnd}))"
							>
								{post.thumbnailText}
							</div>
						</div>
						<div class="flex-1 flex flex-col gap-2">
							<h2 class="text-2xl font-semibold text-bright">{post.title}</h2>
							<p class="text-sm text-default/60">
								Publshed {formatDate(post.date)}
							</p>
							<p class="text-default">{trimDescription(post.description)}</p>
						</div>
					</article>
				</a>
			{/each}
		</div>
	</section>
</main>
