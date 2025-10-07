<script lang="ts">
	import SEO from '$lib/components/common/seo';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Avatar } from '$lib/components/ui/avatar';
	import { Head2, Head3, Head4 } from '$lib/components/ui/heading';
	import { UserPlus, Calendar, MapPin, Building, Link as LinkIcon, Mail, Users } from '@lucide/svelte';
	import { TabSwitch } from '$lib/components/ui/tabswitch';

	let { children, data } = $props();
	let { user } = $state(data);
	
	const isOwnProfile = page.data.currentUser?.id === user.id;
	const isOwn = isOwnProfile ? 'own' : 'other';
	
	let isFollowing = $state(user.isFollowedByCurrentUser);
	let activeTab = $state(0);
	
	const tabs: Record<string, { label: string, href: string }[]> = {
		'other': [
			{ label: 'Profile', href: `/profile/${user.username}` },
			{ label: 'Posts', href: `/profile/${user.username}/posts` },
			{ label: 'Groups', href: `/profile/${user.username}/groups` },
			{ label: 'Badges & Achievements', href: `/profile/${user.username}/achievements` },
		],
		'own': [
			{ label: 'Profile', href: `/profile/${user.username}` },
			{ label: 'Posts', href: `/profile/${user.username}/posts` },
			{ label: 'Reposts', href: `/profile/${user.username}/reposts` },
			{ label: 'Groups', href: `/profile/${user.username}/groups` },
			{ label: 'Badges & Achievements', href: `/profile/${user.username}/achievements` },
			{ label: 'Followers', href: `/profile/${user.username}/followers` },
			{ label: 'Following', href: `/profile/${user.username}/following` },
			{ label: 'Edit Profile', href: `/profile/${user.username}/edit` },
		]
	}

	for (let i = 0; i < tabs[isOwn].length; i++) {
		if (tabs[isOwn][i].href === page.url.pathname) {
			activeTab = i;
			break;
		}
	}

	async function toggleFollow() {
		try {
			const endpoint = isFollowing ? '/api/user/unfollow' : '/api/user/follow';
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: user.id
				})
			});
			
			if (response.ok) {
				isFollowing = !isFollowing;
				if (isFollowing) {
					user.followerCount += 1;
				} else {
					user.followerCount -= 1;
				}
			} else {
				console.error('Failed to follow/unfollow user');
			}
		} catch (error) {
			console.error('Error following/unfollowing user:', error);
		}
	}
	
	const organizations = user.organizations ?? [];
	
	const stats = $derived({
		followers: user.followerCount ?? 0,
		following: user.followingCount ?? 0,
		point: user?.point ?? 0,
	});
	
	const joinedAt = 'Unknown';
</script>

<SEO 
	title={`${user.displayName} (@${user.username})`} 
	description={user.bio || `${user.displayName}'s profile on Quí Sách.`} />

<div class="container px-4 py-8 mx-auto">
	<div class="flex flex-col gap-6 lg:flex-row">
		<div class="w-full lg:w-1/3">
			<div class="p-6 bg-white rounded-lg shadow-md">
				<div class="flex flex-col items-center lg:items-start">
					<div class="relative mb-4">
						<Avatar 
							src={user.avatarUrl}
							alt={`${user.displayName}'s avatar`}
							size="giant"
						/>
						{#if user.emailVerifiedAt}
							<div class="absolute bottom-0 right-0 p-1 text-white bg-blue-500 rounded-full">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-check"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
							</div>
						{/if}
					</div>
					
					<Head2>{user.displayName}</Head2>
					<p class="mb-4 text-gray-600">@{user.username || 'username'}</p>
					
					{#if !isOwnProfile && page.data.currentUser}
						<Button 
							variant={isFollowing ? "outline" : "default"}
							class="w-full mb-4" 
							onclick={toggleFollow}
						>
							<UserPlus class="w-4 h-4 mr-2" />
							{isFollowing ? 'Unfollow' : 'Follow'}
						</Button>
					{/if}
					
					{#if user.bio}
						<p class="mb-4 text-gray-700">{user.bio}</p>
					{/if}
					
					<div class="flex flex-wrap items-center w-full gap-4 mb-4 text-sm text-gray-600">
						<div class="flex items-center gap-1">
							<Users class="w-4 h-4" />
							<span><b>{stats.followers}</b> followers</span>
							<span class="mx-1">·</span>
							<span><b>{stats.following}</b> following</span>
						</div>
					</div>
					
					<div class="w-full space-y-2 text-sm text-gray-600">
						{#if user.location}
							<div class="flex items-center gap-2">
								<MapPin class="w-4 h-4" />
								<span>{user.location}</span>
							</div>
						{/if}
						
						{#if user.email}
							<div class="flex items-center gap-2">
								<Mail class="w-4 h-4" />
								<a href={`mailto:${user.email}`} class="text-blue-600 hover:underline">{user.email}</a>
							</div>
						{/if}
						
						{#if user.website}
							<div class="flex items-center gap-2">
								<LinkIcon class="w-4 h-4" />
								<a href={user.website} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
									{user.website.replace(/(https?:\/\/)?(www\.)?/i, '')}
								</a>
							</div>
						{/if}
						
						<div class="flex items-center gap-2">
							<Calendar class="w-4 h-4" />
							<span>Joined on {joinedAt}</span>
						</div>
					</div>
				</div>
				
				{#if organizations.length > 0}
					<div class="pt-6 mt-6 border-t border-gray-200">
						<Head4 class="mb-3 text-gray-700">Organizations</Head4>
						<div class="flex flex-wrap gap-3">
							{#each organizations as org}
								<a href={`/organizations/${org.id}`} class="flex items-center gap-2 hover:underline">
									<Avatar 
										src={org.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}`}
										alt={`${org.name} logo`}
										size="sm"
									/>
									<span class="text-sm text-gray-800">{org.name}</span>
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
		
		<div class="w-full lg:w-2/3">
			<TabSwitch
				tabs={tabs[isOwn]}
				active={activeTab}
			/>
			{@render children()}
		</div>
	</div>
</div>