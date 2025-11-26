<script lang="ts">
	import { FolderDotIcon, Mail, ArrowRight, ChevronDown } from "lucide-svelte";
	import ProjectCard from "$lib/components/ProjectCard.svelte";
	import HeaderTitle from "$lib/components/HeaderTitle.svelte";
	import { getRepoMetadata, data, getPinnedProjects } from "$lib/data/projects";
	import { onMount } from "svelte";
	import { fadeFly } from "$lib/transitions/transitions";
	import { stagger } from "$lib/utils/staggeredCount";
	import type { CoreTechnologies } from "$lib/types/CoreTechnologies";

	let greetingText = $state("");
	let greetingIndex = 0;

	const coreTechnologies: CoreTechnologies[] = [
		{
			category: "Languages",
			technologies: ["Go", "Java", "Typescript", "Lua"],
		},
		{
			category: "Frameworks",
			technologies: ["Spring Boot", "Svelte", ".NET", "React"],
		},
		{
			category: "Tools & Infrastructure",
			technologies: [
				"Git",
				"MySQL",
				"PostgreSQL",
				"Redis",
				"RabbitMQ",
				"Docker",
			],
		},
	];

	const greetings = [
		"Hello",
		"Hola",
		"Bonjour",
		"こんにちは",
		"Ciao",
		"Hallo",
		"Olá",
		"안녕하세요",
		"Привет",
		"مرحبا",
	];

	let enrichedRepoMetadata = $state(getRepoMetadata(data));

	onMount(() => {
		let charIndex: number = 0;
		let isDeleting: boolean = false;
		let isPaused: boolean = false;
		let timeoutId: NodeJS.Timeout;

		const type: () => void = () => {
			const currentGreeting = greetings[greetingIndex];

			if (isPaused) {
				setTimeout(() => {
					isPaused = false;
					isDeleting = true;
					type();
				}, 3000); // Pause 3 seconds
				return;
			}

			if (isDeleting) {
				greetingText = currentGreeting.substring(0, charIndex);
				charIndex--;

				if (charIndex < 0) {
					isDeleting = false;
					charIndex = 0;
					greetingIndex = (greetingIndex + 1) % greetings.length;
				}

				timeoutId = setTimeout(type, 50);
			} else {
				greetingText = currentGreeting.substring(0, charIndex + 1);
				charIndex++;

				if (charIndex === currentGreeting.length) {
					isPaused = true;
				}

				timeoutId = setTimeout(type, 100);
			}
		};

		type();

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});

	function scrollToProjects() {
		const element = document.getElementById("projects");
		if (element) {
			const navBarHeight = 64;
			const extraPadding = 32;
			const elementPosition =
				element.getBoundingClientRect().top + window.scrollY;
			const offsetPosition = elementPosition - navBarHeight - extraPadding;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	}
</script>

<HeaderTitle
	title="Home"
	description="Portfolio of Daniel Villavicencio - Software Engineer specializing in full-stack web development and modern backend frameworks"
/>
<main class="flex flex-col items-center gap-10 sm:gap-18 md:gap-24">
	<!-- Hero banner -->
	<section
		class="relative flex flex-col items-center justify-center w-full h-[calc(100vh-4rem)] bg-linear-to-br from-slate-700 via-blue-700 to-cyan-600 animate-gradient-shift"
	>
		<div class="gap-6 max-w-6xl p-8 flex flex-col items-center justify-center">
			<h3
				in:fadeFly|global={{ delay: stagger(false), duration: 300, y: 20 }}
				class="text-lg text-bright font-semibold"
			>
				{greetingText}<span>, my name is</span>
			</h3>
			<h1
				in:fadeFly|global={{ delay: stagger(false), duration: 300, y: 20 }}
				class="font-bold text-center text-bright text-6xl md:text-7xl"
			>
				Daniel Villavicencio
			</h1>
			<p
				in:fadeFly|global={{ delay: stagger(false), duration: 300, y: 20 }}
				class="text-xl md:text-2xl text-default font-medium tracking-wide"
			>
				Software Engineer
			</p>
			<h2
				in:fadeFly|global={{ delay: stagger(false), duration: 300, y: 20 }}
				class="text-center text-bright text-md"
			>
				Backend engineer specializing in distributed systems, cloud
				architecture, and high-performance applications. Passionate about
				building robust, scalable solutions that solve real-world problems.
			</h2>

			<!-- Action buttons -->
			<div
				class="flex flex-col sm:flex-row justify-center max-w-1xl w-full gap-4 pt-4 pb-2"
			>
				<a
					href="/contact"
					in:fadeFly|global={{
						delay: stagger(false),
						duration: 300,
						y: 20,
					}}
					aria-label="Connect button"
					class="group
				flex gap-2 px-8 py-3 border items-center justify-center text-bright border-bright rounded lg:text-default lg:border-default
				hover:text-bright hover:border-bright transition-all duration-300 cursor-pointer"
				>
					<span class="text-sm">Contact Me</span>
					<Mail class="w-4 h-4" />
				</a>
				<a
					href="/projects"
					aria-label="Portfolio button"
					in:fadeFly|global={{
						delay: stagger(false),
						duration: 300,
						y: 20,
					}}
					class=" group
				flex px-6 py-3 gap-2 border items-center justify-center text-bright border-bright rounded lg:text-default lg:border-default
				hover:text-bright hover:border-bright transition-all duration-300 cursor-pointer"
				>
					<span class="text-sm">View Projects</span>
					<FolderDotIcon class="w-4 h-4" />
				</a>
			</div>
		</div>

		<button
			onclick={scrollToProjects}
			aria-label="Scroll to Projects"
			class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hover:cursor-pointer"
		>
			<ChevronDown class="w-6 h-6 text-cyan-400/90" />
		</button>
	</section>

	<!-- Featured Projects -->
	<section
		id="projects"
		in:fadeFly={{ delay: stagger(true), duration: 300 }}
		class="relative max-w-6xl px-8 py-4 flex flex-col items-center gap-6"
	>
		<h2 class="text-2xl text-bright text-center font-semibold">
			Featured Projects
		</h2>
		<p class="text-sm text-center">
			These are projects I actively maintain and/or am currently working on
		</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
			{#await enrichedRepoMetadata}
				{#each [1, 2, 3] as _}
					<ProjectCard />
				{/each}
			{:then projects}
				{#each getPinnedProjects(projects) as project}
					<ProjectCard {project} />
				{/each}
			{/await}
		</div>
	</section>

	<!-- Core Technologies -->
	<section class="relative max-w-6xl px-8 py-4 flex flex-col gap-6">
		<h2
			in:fadeFly={{ delay: stagger(true), duration: 300, y: 20 }}
			class="text-2xl text-bright text-center font-semibold"
		>
			Core Technologies
		</h2>
		{#each coreTechnologies as tech}
			<h3
				in:fadeFly|global={{ delay: stagger(true), duration: 150, y: 20 }}
				class="font-semibold text-lg text-bright text-center"
			>
				{tech.category}
			</h3>
			<div class="flex flex-row flex-wrap justify-center gap-2">
				{#each tech.technologies as elem}
					<div
						in:fadeFly|global={{
							delay: stagger(false),
							duration: 200,
							y: 20,
						}}
						class="relative py-1 px-2 bg-bg-dark border border-border-default uppercase text-xs hover:bg-bg-default"
					>
						{elem}
					</div>
				{/each}
			</div>
		{/each}
	</section>

	<!-- Learn more about me -->
	<section
		in:fadeFly={{ delay: stagger(true), duration: 300, y: 20 }}
		class="relative px-8"
	>
		<div class="flex flex-col gap-6 p-4 items-center">
			<h1 class="text-xl text-bright text-center font-bold">
				Learn more about my journey
			</h1>
			<p class="text-sm text-default text-center">
				Learn about my philosophy, career milestones, and what I'm currently
				focused on building
			</p>
			<div class="flex">
				<a
					href="/about"
					class="inline-flex group items-center gap-2 px-4 py-2 bg-bg-card text-default border border-border-default rounded
					hover:bg-bg-dark transition-all duration-150"
				>
					Read my story
					<ArrowRight
						class="w-4 h-4 group-hover:translate-x-2 transition-all 300"
					/>
				</a>
			</div>
		</div>
	</section>
</main>

<style>
	@keyframes gradient-shift {
		0% {
			background-position: 0% 0%;
			background-size: 300% 300%;
		}

		25% {
			background-position: 100% 0%;
			background-size: 300% 300%;
		}
		50% {
			background-position: 100% 100%;
			background-size: 300% 300%;
		}

		75% {
			background-position: 0% 100%;
			background-size: 300% 300%;
		}
		100% {
			background-position: 0% 0%;
			background-size: 300% 300%;
		}
	}
	.animate-gradient-shift {
		animation: gradient-shift 8s ease-in-out infinite;
	}
</style>
