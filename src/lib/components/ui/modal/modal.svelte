<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import { X } from '@lucide/svelte';
	import { Dialog } from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Head5 } from '$lib/components/ui/heading';

	interface Props {
		trigger?: Snippet;
		content: Snippet;
		isOpen?: boolean;
		title: string;
		footer?: Snippet;
	}

	let {
		trigger,
		content,
		isOpen = $bindable(false),
		title = 'Modal',
		footer
	}: Props = $props();
</script>

{#if trigger}
<Dialog {trigger} bind:isOpen>
	{#snippet content()}
		<div
			class="rounded-lg bg-white p-4 "
			transition:fly={{ y: 20, duration: 200 }}
		>
			<div class="flex items-center justify-between">
				<Head5 id="dialog-title">{title}</Head5>
				<Button
					class="text-gray-500"
					size="icon"
					variant="ghost"
					onclick={() => (isOpen = false)}
					aria-label="Close modal"
				>
					<X size={20} />
				</Button>
			</div>

			<div class="mt-4 space-y-4">
				{@render content()}
			</div>

			{#if footer}
				<div class="mt-8 flex justify-end gap-2">
					{@render footer()}
				</div>
			{/if}
		</div>
	{/snippet}
</Dialog>
{:else} 
{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		onclick={() => (isOpen = false)}
		transition:fade={{ duration: 100 }}
		aria-hidden="true"
	></div>
	<div
		class="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
		role="dialog"
		aria-label={title}
		tabindex={-1}
	>
		<div
			class="rounded-lg bg-white p-4 "
			transition:fly={{ y: 20, duration: 200 }}
		>
			<div class="flex items-center justify-between">
				<Head5 id="dialog-title">{title}</Head5>
				<Button
					class="text-gray-500"
					size="icon"
					variant="ghost"
					onclick={() => (isOpen = false)}
					aria-label="Close modal"
				>
					<X size={20} />
				</Button>
			</div>

			<div class="mt-4 space-y-4">
				{@render content()}
			</div>

			{#if footer}
				<div class="mt-8 flex justify-end gap-2">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
{/if}