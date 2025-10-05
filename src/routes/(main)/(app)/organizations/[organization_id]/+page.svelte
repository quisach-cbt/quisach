<script lang='ts'>
	import { Home, Users } from '@lucide/svelte';
	import { Dialog } from '$lib/components/ui/dialog';
	import { Post, PostDialog } from '$lib/components/features/post';
	import { Head3, Head5 } from '$lib/components/ui/heading';

	const { data } = $props();
	const { posts } = data;
</script>

<div class='flex flex-col gap-4 mb-8'>
	{#if posts.length === 0}
		<div class='flex flex-col items-center justify-center gap-4 mt-16 w-full h-full'>
			<Home class='w-16 h-16 text-gray-400' />
			<Head3 class='text-gray-500'>No posts yet</Head3>
			<Head5 class='text-gray-400'>Start following people to see their posts</Head5>
		</div>
	{:else}
		<div class='flex flex-col gap-4 mt-4'>
			{#each posts as post, index}
				<Dialog>
					{#snippet trigger()}
						<Post {post} />
					{/snippet}
					{#snippet content()}
						<PostDialog bind:post={posts[index]} />
					{/snippet}
				</Dialog>
			{/each}
		</div>
	{/if}
</div>