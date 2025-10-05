<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Head2 } from '$lib/components/ui/heading';
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import { OrgCard } from '$lib/components/features/organization';

	let { data }: PageProps = $props();
	const { myOrganizations, organizations } = data;
</script>

<svelte:head>
	<title>Organization | BTOI: Ben Tre Olympiad in Informatics</title>
</svelte:head>

<div class="w-full px-8 md:px-12 xl:px-16 3xl:px-32 py-8 space-y-8 *:space-y-4">
	{#if page.data.currentUser}
		<section>
			<div class='flex justify-between items-center'>
				<Head2>My Organizations</Head2>
				{#if page.data.currentUser.role === 'ADMIN'}
					<Button href="/organizations/create">Create Organization</Button>
				{/if}
			</div>
			<div class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-6">
				{#each myOrganizations as org (org.id)}
					<OrgCard {org} />
				{:else}
					<p class="py-12 text-center text-lg text-gray-500">
						You are not a member of any organization.
					</p>
				{/each}
			</div>
		</section>
	{/if}
	<section>
		<Head2>Explore Organizations</Head2>
		<div class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-6">
			{#each organizations as org (org.id)}
				<OrgCard {org} />
			{:else}
				<p class="py-12 text-center text-lg text-gray-500">
					No organizations found.
				</p>
			{/each}
		</div>
	</section>
</div>
