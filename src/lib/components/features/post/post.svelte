<script lang="ts">
	import { Avatar } from '$lib/components/ui/avatar';
	import { Head5, Head4 } from '$lib/components/ui/heading';
	import { cn, getRelativeTime } from '$lib/utils';
	import { Heart, MessageCircle, Repeat2 } from '@lucide/svelte';
	import parseMarkdown from '$lib/markdown_parsers/post';

	let { post } = $props();
</script>

<div
	class="flex h-[450px] min-w-[400px] flex-col gap-2 rounded-md border-2 bg-white p-4 transition-all duration-300 hover:shadow-xl"
>
	<div class="flex items-center gap-3">
		<Avatar size="sm" src={post.author.avatarUrl} alt="{post.author.displayName}'s Avatar" />
		<a href="/profile/{post.author.username}" class="font-semibold">{post.author.displayName}</a>
		<time datetime={post.createdAt} class="text-xs text-gray-500"
			>{getRelativeTime(post.createdAt)}</time
		>
		{#if post.pinned}
			<span class="px-2 py-1 ml-auto text-xs rounded-full bg-primary/20 text-primary">Pinned</span>
		{/if}
	</div>

	<article>
		<Head4>{post.title}</Head4>
		<div class="text-gray-600 markdown-preview line-clamp-7">
			{#await parseMarkdown(post.content)}
				Loading...
			{:then content}
				{@html content}
			{/await}
		</div>
	</article>

	<div class="flex items-center gap-4 mt-auto">
		<button class="flex items-center gap-1 transition-colors hover:text-primary">
			<Heart size={20} />
			<span>{post._count.reactions ?? 0}</span>
		</button>
		<button class="flex items-center gap-1 transition-colors hover:text-primary">
			<MessageCircle size={20} />
			<span>{post._count.comments ?? 0}</span>
		</button>
		<button class="flex items-center gap-1 transition-colors hover:text-primary">
			<Repeat2 size={20} />
			<span>{post._count.reposts ?? 0}</span>
		</button>
	</div>
</div>

<style>
	@reference "tailwindcss";
	.markdown-preview :global(h1) {
		@apply text-2xl font-bold mb-4;
	}

	.markdown-preview :global(h2) {
		@apply text-xl font-bold mb-4;
	}

	.markdown-preview :global(p) {
		@apply text-gray-700 mb-4;
	}

	.markdown-preview :global(ul) {
		list-style-type: disc;
		margin-left: 1.5rem;
		margin-bottom: 1rem;
	}

	.markdown-preview :global(pre) {
		background-color: #f5f5f5;
		padding: 1rem;
		border-radius: 0.25rem;
		overflow-x: auto;
	}

	.markdown-preview :global(code) {
		font-family: 'Lexend';
	}
</style>
