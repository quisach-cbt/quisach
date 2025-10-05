<!-- 
@component
A base dialog component that can be used to display content in a modal format. It can be triggered by a button or any other element.
@param {boolean} isOpen - Controls the visibility of the dialog.
@param {Snippet | string} trigger - The element that triggers the dialog when clicked. If a string is provided, it will be rendered as a button.
@param {Snippet} content - The content to be displayed inside the dialog.
-->

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		isOpen?: boolean;
		willCloseOnBackdropClick?: boolean;
		trigger: Snippet | string;
		content: Snippet;
		title?: string;
	}

	let {
		isOpen = $bindable(false),
		willCloseOnBackdropClick = true,
		trigger,
		content,
		title = 'Dialog'
	}: Props = $props();
</script>

{#if typeof trigger === 'string'}
	<Button>{trigger}</Button>
{:else}
	<div
		class="contents"
		role="button"
		tabindex={0}
		onclick={() => (isOpen = true)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') isOpen = true;
		}}
	>
		{@render trigger()}
	</div>
{/if}

<svelte:document
	onkeydown={(e) => {
		if (e.key === 'Escape' && isOpen) isOpen = false;
		console.log('e.key', e.key);
		
	}}
/>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		onclick={() => { if (willCloseOnBackdropClick) isOpen = false; }}
		transition:fade={{ duration: 100 }}
		aria-hidden="true"
	></div>
	<div
		class="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
		role="dialog"
		aria-label={title}
		aria-modal="true"
		aria-labelledby="dialog-title"
		aria-describedby="dialog-description"
		tabindex={-1}
		transition:fly={{ y: 20, duration: 200 }}
	>
		{@render content()}
	</div>
{/if}
