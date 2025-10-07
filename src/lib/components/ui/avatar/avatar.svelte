<script lang="ts">
	import { DEFAULT_AVATAR_URL } from '$lib/const';
	import { cn } from '$lib/utils';
	import { avatarVariants, type AvatarVariants } from '.';

	interface Props extends AvatarVariants {
		class?: string;
		src?: string; 
		alt?: string;
		href?: string;
		[prop: string]: unknown;
	};

	let { class: className, src, href: hRef, size = 'default', alt = 'Default avatar', ...rest }: Props = $props();
</script>

{#snippet avatar()}
	<img class={cn(avatarVariants({ size, className }))} src={src || DEFAULT_AVATAR_URL} {alt} {...rest}>
{/snippet}

{#if hRef}
	<a href={hRef} aria-label="Link to user">
		{@render avatar()}
	</a>
{:else}
	{@render avatar()}
{/if}