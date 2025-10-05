<script lang="ts">
	import { Avatar } from '$lib/components/ui/avatar';
	import { cn, plrl } from '$lib/utils';
	import { BadgeCheck } from '@lucide/svelte';
	import type { Organization } from '@prisma/client';

	interface Props {
		org: Organization & {
			_count: {
				OrganizationMember: number;
			};
		};
		class?: string;
	}

	let { org, class: className }: Props = $props();
</script>

<a
	title={org.name}
	href="/organizations/{org.id}"
	class={cn(
		'max-h-72 overflow-hidden rounded-md bg-white ring-1 ring-gray-300 duration-200 hover:shadow-sm hover:ring-2 focus:ring-2 focus:ring-offset-2 focus:outline-none',
		className
	)}
>
	<div class="from-primary/80 to-primary h-36 w-full flex-shrink-0 bg-gradient-to-r">
		{#if org.bannerUrl}<img
				src={org.bannerUrl}
				alt="{org.name} banner"
				class="h-full w-full object-cover"
			/>{/if}
	</div>

	<div class="-mt-10 flex flex-grow flex-col p-4">
		<Avatar class="rounded-lg ring-4 ring-white" src={org.logoUrl} size="lg" />
		<div class="mt-1 flex items-center justify-between">
			<span class="overflow-hidden text-lg font-bold text-nowrap text-ellipsis"
				>{org.name}</span
			>
			{#if org.isVerified}<BadgeCheck color="white" fill="blue" />{/if}
		</div>

		<p class={cn('line-clamp-3 text-gray-600')}>
			{org.description ?? 'This organization has no description.'}
		</p>

		<div class="mt-2 flex items-center justify-between text-gray-500">
			<span class="flex items-center gap-1">
				{org._count.OrganizationMember}
				{plrl(org._count.OrganizationMember, 'Member')}
			</span>
		</div>
	</div>
</a>
