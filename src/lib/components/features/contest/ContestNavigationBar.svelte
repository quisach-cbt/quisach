<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	const { contest_id } = page.params;

	const contestNav = [
		{ name: 'Contest home', path: `` },
		{ name: 'Contest problems', path: `/problems` },
		{ name: 'Submit', path: `/submit` },
		{ name: 'All submissions', path: `/submissions` },
		{ name: 'Leaderboard', path: `/leaderboard` },
		{ name: 'Code editor', path: `/editor` }
	];
</script>

<ul class="text-text-muted flex gap-3 pt-2 px-2">
	{#each contestNav as { name, path }}
		{@const truePath = `/contests/${contest_id}${path}`}
		<li
			class={cn(
				'transition-color rounded-md p-2 duration-200 ease-in-out hover:bg-gray-200',
				page.url.pathname === truePath && 'text-text rounded-b-none border-b-2 border-b-black'
			)}
		>
			<a href={truePath}>
				{name}
			</a>
		</li>
	{/each}
</ul>
