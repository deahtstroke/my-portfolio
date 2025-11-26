<script lang="ts">
	import { formatDate } from "$lib/utils/date";
	import type { PageProps } from "./$types";

	let data: PageProps = $props();
</script>

<svelte:head>
	<meta property="og:type" content="article" />
</svelte:head>

<article class="flex flex-col items-center gap-4 px-8 py-4 m-auto">
	<hgroup class="flex flex-col gap-4 border-b border-default/50 pb-8">
		<div class="flex flex-row flex-wrap gap-1">
			{#each data.data.metadata.categories as category}
				<span
					class="px-2 py-1 text-[10px] tracking-wider bg-bg-dark uppercase border border-border-default"
					>{category}</span
				>
			{/each}
		</div>
		<h1 class="text-4xl text-bright font-semibold">
			{data.data.metadata.title}
		</h1>
		<p class="text-base text-default/60">{data.data.metadata.description}</p>
		<p class="text-sm">
			Published on {formatDate(data.data.metadata.date)}
		</p>
	</hgroup>

	<div class="prose">
		<data.data.content />
	</div>
</article>
