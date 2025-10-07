<script lang="ts">
	import { Head4 } from '$lib/components/ui/heading';
	import { Button } from '$lib/components/ui/button';
	import { Modal } from '$lib/components/ui/modal';
	import parseMarkdown from '$lib/markdown_parsers/post';
	import { onMount } from 'svelte';

	const { data } = $props();
	let { user } = data;
	let userAboutMe = $state(user.aboutMe ?? '');
	let editAboutMeOpen = $state(false);
	let renderAboutMe = $state('');
	let saveAboutMeModalOpen = $state(false);

	let commitData: { [key: string]: number } = $state({
		// Format: { 'YYYY-MM-DD': count }
		'2025-04-01': 2,
		'2025-04-02': 5,
		'2025-04-03': 1,
		'2025-04-05': 3,
		'2025-04-08': 7,
		'2025-04-10': 4,
		'2025-04-12': 2,
		'2025-04-15': 5,
		'2025-04-18': 8,
		'2025-04-20': 6,
		'2025-04-22': 3,
		'2025-04-25': 4,
		'2025-04-28': 2,
		'2025-04-30': 9
	});

	let days = $state<{ date: string; count: number }[]>([]);
	let totalCommits = $state(0);

	onMount(() => {
		generateContributionData();
	});

	function generateContributionData() {
		const today = new Date();
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(today.getFullYear() - 1);

		const tempDays = [];
		let currentDate = new Date(oneYearAgo);

		while (currentDate <= today) {
			const dateString = formatDate(currentDate).toString();
			const count = commitData[dateString] ?? 0;
			tempDays.push({
				date: dateString,
				count: count
			});

			totalCommits += count;
			currentDate.setDate(currentDate.getDate() + 1);
		}

		days = tempDays;
	}

	function formatDate(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function getColorClass(count: number): string {
		if (count === 0) return 'bg-gray-100';
		if (count <= 2) return 'bg-green-100';
		if (count <= 4) return 'bg-green-300';
		if (count <= 6) return 'bg-green-500';
		return 'bg-green-700';
	}

	function getMonthLabels(): { month: string; index: number }[] {
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		const labels = [];

		const uniqueMonths = new Set();
		for (const day of days) {
			const month = day.date.substring(5, 7);
			uniqueMonths.add(month);
		}

		for (const monthNum of [...uniqueMonths].sort()) {
			const monthIndex = parseInt(monthNum as string) - 1;
			labels.push({
				month: months[monthIndex],
				index: days.findIndex((d) => d.date.substring(5, 7) === monthNum)
			});
		}

		return labels;
	}

	(async () => {
		try {
			renderAboutMe = await parseMarkdown(userAboutMe);
		} catch (error) {
			console.error('Error parsing markdown:', error);
		}
	})();

	async function updatePreview() {
		parseMarkdown(userAboutMe)
			.then((parsed) => {
				renderAboutMe = parsed;
			})
			.catch((error) => {
				console.error('Error parsing markdown:', error);
			});
	}

	async function handleSaveAboutMe() {
		if (userAboutMe.length > 1000) {
			saveAboutMeModalOpen = true;
			return;
		}
		try {
			const response = await fetch(`/api/user/saveAboutMe`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					aboutMe: userAboutMe
				})
			});
			editAboutMeOpen = false;
		} catch (error) {
			console.error('Error saving about me:', error);
		}
	}
</script>

<div class="mt-4 rounded-lg bg-white p-6 shadow-md">
	<div class="flex items-center gap-4">
		<Head4>About me</Head4>
		<div class="flex-grow"></div>
		{#if user.isOwnProfile}
			{#if !editAboutMeOpen}
				<Button
					onclick={() => {
						editAboutMeOpen = true;
					}}
				>
					Edit
				</Button>
			{:else}
				<Button variant="outline" onclick={handleSaveAboutMe}>Save</Button>
			{/if}
		{/if}
	</div>
	<hr class="my-4 border-gray-300" />
	{#if editAboutMeOpen}
		<div class="text-sm text-gray-700">
			<textarea
				class="h-32 w-full rounded-md border border-gray-300 p-2"
				bind:value={userAboutMe}
				oninput={updatePreview}
				placeholder="Write something about yourself..."
			></textarea>
			<div class="font-body mt-1 text-xs text-gray-500">
				<p>Markdown supported</p>
				<p>Max 1000 characters</p>
				<p>Preview:</p>
			</div>
			<div class="rounded-md bg-gray-100 p-2">
				{#if userAboutMe}
					<div class="markdown-preview">
						{@html renderAboutMe}
					</div>
				{:else}
					<p class="text-gray-500">Nothing to show</p>
				{/if}
			</div>
		</div>
	{:else}
		<div class="text-sm text-gray-700">
			{#if userAboutMe}
				<div class="markdown-preview">
					{@html renderAboutMe}
				</div>
			{:else}
				<p class="text-gray-500">No document available for this profile</p>
			{/if}
		</div>
	{/if}
</div>

<div class="mt-4 rounded-lg bg-white p-6 shadow-md">
	<div class="flex items-center gap-4">
		<Head4>Submissions</Head4>
		<div class="flex-grow"></div>
	</div>
	<hr class="my-4 border-gray-300" />

	<div class="contribution-wrapper">
		<h5 class="mb-2 text-sm font-bold">{totalCommits} submissions in the last year</h5>

		<div class="contribution-graph">
			<div class="month-labels">
				{#each getMonthLabels() as { month, index }}
					<div class="month-label" style="left: {(index / days.length) * 100}%">
						{month}
					</div>
				{/each}
			</div>

			<div class="contribution-grid">
				{#each days as day, i}
					<div
						class="contribution-cell {getColorClass(day.count)}"
						title="{day.count} submissions on {day.date}"
					></div>
				{/each}
			</div>

			<div class="legend mt-2 flex items-center justify-end text-xs text-gray-600">
				<span class="mr-1">Less</span>
				<div class="mr-1 h-3 w-3 rounded-sm bg-gray-100"></div>
				<div class="mr-1 h-3 w-3 rounded-sm bg-green-100"></div>
				<div class="mr-1 h-3 w-3 rounded-sm bg-green-300"></div>
				<div class="mr-1 h-3 w-3 rounded-sm bg-green-500"></div>
				<div class="mr-1 h-3 w-3 rounded-sm bg-green-700"></div>
				<span>More</span>
			</div>
		</div>
	</div>
</div>

<div class="mt-4 rounded-lg bg-white p-6 shadow-md">
	<div class="flex items-center gap-4">
		<Head4>Recent badges & achievements</Head4>
		<div class="flex-grow"></div>
	</div>
	<hr class="my-4 border-gray-300" />

	<div class="text-sm text-gray-700">
		<p class="text-gray-500">No badges or achievements available for this profile</p>
	</div>
</div>

<!-- <Modal title="Cannot save changes" bind:isOpen={saveAboutMeModalOpen} size="md">
	{#snippet children()}
		<p class="text-sm text-gray-600">
			You have exceeded the maximum character limit of 1000 characters. Please shorten your input
			before saving.
		</p>
	{/snippet}

	{#snippet footer()}
		<Button variant="outline" onclick={() => (saveAboutMeModalOpen = false)}>Close</Button>
	{/snippet}
</Modal> -->

<style>
	.markdown-preview :global(h1) {
		font-size: 1.8rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.markdown-preview :global(h2) {
		font-size: 1.5rem;
		font-weight: bold;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.markdown-preview :global(p) {
		margin-bottom: 1rem;
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

	.contribution-wrapper {
		margin-top: 1rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.contribution-graph {
		position: relative;
		margin-top: 1.5rem;
	}

	.month-labels {
		display: flex;
		position: relative;
		height: 20px;
	}

	.month-label {
		position: absolute;
		font-size: 0.75rem;
		color: #4b5563;
	}

	.contribution-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12px, 1fr));
		grid-gap: 2px;
		margin-top: 0.5rem;
	}

	.contribution-cell {
		width: 12px;
		height: 12px;
		border-radius: 2px;
	}

	@media (max-width: 768px) {
		.contribution-grid {
			grid-template-columns: repeat(auto-fill, minmax(10px, 1fr));
			grid-gap: 1px;
		}

		.contribution-cell {
			width: 10px;
			height: 10px;
		}
	}
</style>
