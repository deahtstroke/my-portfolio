<script lang="ts">
	import { ArrowDown, ArrowUp, Search, X } from "lucide-svelte";
	import ProjectCard from "$lib/components/ProjectCard.svelte";
	import HeaderTitle from "$lib/components/HeaderTitle.svelte";

	import { data as projects, getRepoMetadata } from "$lib/data/projects";
	import { fadeFly } from "$lib/transitions/transitions";
	import { stagger } from "$lib/utils/staggeredCount";
	import { onMount } from "svelte";

	let searchQuery = $state<string>("");
	let sortBy = $state<"name" | "techCount" | "updateDate" | "creationDate">(
		"name",
	);
	let sortOrder = $state<"asc" | "desc">("asc");
	let baseProjects = $state(projects);

	let filteredProjects = $derived(
		baseProjects
			.filter((p) => {
				if (!searchQuery.trim()) {
					return true;
				}

				const query = searchQuery.toLowerCase();
				return (
					p.title.toLowerCase().includes(query) ||
					p.description.toLowerCase().includes(query) ||
					p.technologies.some((t) => t.toLowerCase().includes(query))
				);
			})
			.sort((a, b) => {
				switch (sortBy) {
					case "name":
						return sortOrder === "asc"
							? a.title.localeCompare(b.title)
							: b.title.localeCompare(a.title);
					case "techCount":
						return sortOrder === "asc"
							? a.technologies.length - b.technologies.length
							: b.technologies.length - a.technologies.length;
					case "updateDate":
						if (a.lastUpdatedAt && b.lastUpdatedAt) {
							return sortOrder === "asc"
								? a.lastUpdatedAt.getTime() - b.lastUpdatedAt.getTime()
								: b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime();
						} else return 0;
					case "creationDate":
						if (a.createdAt && b.createdAt) {
							return sortOrder === "asc"
								? a.createdAt.getTime() - b.createdAt.getTime()
								: b.createdAt.getTime() - a.createdAt.getTime();
						} else return 0;
					default:
						return 0;
				}
			}),
	);

	let hasActiveFilters = $derived(searchQuery.trim() != "");

	function toggleSortOrder() {
		sortOrder = sortOrder === "asc" ? "desc" : "asc";
		localStorage.setItem("projectsSortOrder", sortOrder);
	}

	function clearFilters() {
		searchQuery = "";
		sortBy = "name";
	}

	// Enrich data on component being mounted
	onMount(async () => {
		try {
			const response = await getRepoMetadata(projects);
			baseProjects = response;
		} catch (error) {
			console.log(error);
		}
	});
</script>

<HeaderTitle
	title="Projects"
	description="Showcase of Daniel Villavicencio's projects across several disciplines 
	and a wide range of technologies"
/>

<main class="w-full px-8">
	<div class="max-w-4xl mx-auto flex flex-col items-center gap-8 sm:gap-12">
		<!-- Hero section -->
		<section class="relative py-12 flex flex-col gap-6 items-center">
			<h1
				in:fadeFly={{ delay: stagger(false), duration: 300, y: 20 }}
				class="font-bold text-center text-bright text-5xl md:text-7xl"
			>
				Projects
			</h1>
			<p
				in:fadeFly={{ delay: stagger(false), duration: 300, y: 20 }}
				class="text-lg text-default text-center"
			>
				Explore my work across various technologies and domains
			</p>
		</section>

		<!-- Search panel -->

		<div
			class="flex flex-col w-full md:flex-row gap-4 items-start md:items-center justify-between"
		>
			<!-- Search bar -->
			<div
				class="relative flex-1 w-full"
				in:fadeFly={{ delay: stagger(false), duration: 300, y: 20 }}
			>
				{#if hasActiveFilters}
					<X
						onclick={() => (searchQuery = "")}
						class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bright hover:cursor-pointer"
					/>
				{:else}
					<Search
						class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bright"
					/>
				{/if}
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search Projects or Technologies..."
					class="pl-10 w-full pr-4 py-2 bg-bg-dark border border-border-default rounded placeholder:text-bright/40 text-default focus:outline-none focus:border-cyan-500 transition-colors"
				/>
			</div>

			<!-- Sorting Options -->
			<div
				in:fadeFly|global={{ delay: stagger(false), duration: 300, y: 20 }}
				class="flex flex-row gap-2"
			>
				<div class="flex items-center gap-2">
					<select
						bind:value={sortBy}
						class="px-4 py-2 bg-bg-dark border border-border-default rounded focus:outline-none focus:border-cyan-500 transition-colors"
					>
						<option value="name">Name</option>
						<option value="techCount">Tech #</option>
						<option value="creationDate">Creation Date</option>
						<option value="updateDate">Update Date</option>
					</select>
				</div>
				<button
					onclick={toggleSortOrder}
					aria-label="Sorting ascending/descending button"
					class="text-default flex items-center gap-2 px-3 py-2 bg-bg-dark border border-border-default rounded hover:border-cyan-500 hover:text-bright"
				>
					{#if sortOrder === "asc"}
						<ArrowUp class="w-4 h-4" />
					{:else}
						<ArrowDown class="w-4 h-4" />
					{/if}
					<span class="text-xs uppercase md:hidden">
						{sortOrder === "asc" ? "A-Z" : "Z-A"}
					</span>
				</button>
			</div>
		</div>

		<!-- Project Results -->
		<section
			class="flex flex-col items-center gap-6"
			in:fadeFly={{ delay: stagger(true), duration: 300, y: 20 }}
		>
			{#if filteredProjects.length > 0}
				<h3 class="text-default font-light">
					Showing {filteredProjects.length} of {projects.length} projects
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each filteredProjects as project (project.title)}
						<ProjectCard {project} />
					{/each}
				</div>
			{:else}
				<div
					class="w-16 h-16 border-2 border-neutral-800 flex items-center justify-center"
				>
					<Search class="w-8 h-8 text-neutral/700" />
				</div>
				<div class="text-center space-y-2">
					<h3 class="text-xl font-semibold text-default">No Projects Found</h3>
					<p class="text-default text-center max-w-md">
						Try adjusting your search or filters to find what you're looking for
					</p>
					{#if hasActiveFilters}
						<button
							onclick={clearFilters}
							class="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-bright transition-colors"
						>
							Clear all filters
						</button>
					{/if}
				</div>
			{/if}
		</section>
	</div>
</main>
