<script module>
	export interface Props extends ButtonVariantsProps, HTMLButtonAttributes { children: Snippet, class?: string, href?: string };
</script>

<script lang='ts'>
	import { cn } from '$lib/utils';
	import { buttonVariants, type ButtonVariantsProps } from '.';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	
	let { children, type = 'button', class: className, href, variant, size, ...rest }: Props = $props();
</script>

<button
	class={cn(buttonVariants({ variant, size, className }))}
	onclick={() => { if (href) goto(href); }}
	{type}
	{...rest}
>
	{@render children()}
</button>
