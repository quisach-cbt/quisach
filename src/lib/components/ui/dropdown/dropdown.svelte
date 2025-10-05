<script lang="ts">
	import { cn } from '$lib/utils';
	import { dropdownVariants, type DropdownProps } from '.';
	import type { Snippet } from 'svelte';

	interface Props extends DropdownProps {
		trigger: Snippet;
		content: Snippet;
		triggertype?: 'hover' | 'click';
	}

	let { position = 'bottom', trigger, content, triggertype = 'hover' }: Props = $props();

	let isOpen = $state<boolean>(false);
	const id = `menu-id-${Math.random() * 1000000}`;
</script>

<div
	class="relative"
	role="combobox"
	aria-haspopup="menu"
	aria-controls={id}
	aria-expanded={isOpen}
	tabindex="-1"
	onmouseenter={() => {
		if (triggertype === 'hover') isOpen = true;
	}}
	onmouseleave={() => {
		if (triggertype === 'hover') isOpen = false;
	}}
>
	<div class="contents cursor-pointer">{@render trigger()}</div>
	{#if isOpen}
		<div
			{id}
			class={cn(dropdownVariants({ position }))}
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			{@render content()}
		</div>
	{/if}
</div>
