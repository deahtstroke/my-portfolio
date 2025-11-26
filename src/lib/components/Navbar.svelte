<script lang="ts">
	import HamburgerButton from "./HamburgerButton.svelte";
	import Sidebar from "./Sidebar.svelte";
	import { page } from "$app/state";
	import {
		User,
		Briefcase,
		Mail,
		Github,
		Home,
		FileText,
		Notebook,
	} from "lucide-svelte";

	import type { MenuOption } from "$lib/types/MenuOption";

	let menuOptions: MenuOption[] = [
		{
			name: "Home",
			desc: "Go back to Homepage",
			ref: "/",
			icon: Home,
		},
		{
			name: "Projects",
			desc: "View my work",
			ref: "/projects",
			icon: Briefcase,
		},
		{
			name: "Blog",
			desc: "Read my Blog",
			ref: "/blog",
			icon: Notebook,
		},
		{
			name: "Contact",
			desc: "Get in touch with me",
			ref: "/contact",
			icon: Mail,
		},
		{
			name: "About",
			desc: "Learn more about me",
			ref: "/about",
			icon: User,
		},
		{
			name: "Resume",
			desc: "See my resume",
			ref: "/resume",
			icon: FileText,
		},
		{
			name: "Source",
			desc: "View code for this page",
			ref: "https://www.github.com/deahtstroke/Daniel",
			target: "_blank",
			icon: Github,
		},
	];

	let sidebarOpen: boolean = $state<boolean>(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<nav class="sticky top-0 h-18 backdrop-blur-md z-40">
	<div
		class="max-w-6xl m-auto h-full px-8 py-4 flex flex-row align-middle items-center"
	>
		<a
			class="font-bold mr-auto tracking-wide text-bright text-md hover:cursor-pointer"
			href="/"
		>
			<h1>Daniel Villavicencio</h1>
		</a>

		<!-- NavBar options desktop -->
		<ul class="flex flex-row gap-4 mx-2 justify-center content-center">
			{#each menuOptions as option}
				<li>
					<a
						href={option.ref}
						target={option.target ? option.target : ""}
						class="group relative hidden md:inline-block content-center cursor-pointer text-default hover:text-bright"
					>
						{option.name}
						{#if option.ref === page.url.pathname}
							<div
								class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
							></div>
						{/if}
					</a>
				</li>
			{/each}
			<li class="block md:hidden relative content-start">
				<HamburgerButton onclick={toggleSidebar} />
			</li>
		</ul>
	</div>
</nav>

<!-- Mobile side bar -->
<Sidebar onclick={toggleSidebar} open={sidebarOpen} options={menuOptions} />
