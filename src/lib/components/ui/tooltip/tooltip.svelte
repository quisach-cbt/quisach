<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		children: Snippet;
		content: Snippet;
		delay?: number;
		class?: string;
		[prop: string]: unknown;
	}

	let { children, content, delay = 400, class: className, ...rest }: Props = $props();

	let isOpen = $state<boolean>(false);
</script>

<div class="relative inline-block bg-amber-200">
	<div
		onfocus={() => (isOpen = true)}
		onfocusout={() => (isOpen = false)}
		onmouseenter={() => (isOpen = true)}
		onmouseleave={() => (isOpen = false)}
		role="button"
		tabindex="0"
	>
		{@render children()}
	</div>

	{#if isOpen}
		<div
			role="tooltip"
			class={cn(
				'absolute bottom-full left-1/2 -translate-x-1/2 rounded-md bg-white px-2 py-1 shadow-md',
				className
			)}
			in:fly={{ y: 10, duration: 100, delay }}
			{...rest}
		>
			<svg
				width="16"
				height="6"
				viewBox="0 0 20 10"
				class="absolute -bottom-[6px] left-1/2 -translate-x-1/2 rotate-180"
			>
				<path d="M0,10 L10,0 L20,10" fill="white" />
			</svg>
			{@render content()}
		</div>
	{/if}
</div>
