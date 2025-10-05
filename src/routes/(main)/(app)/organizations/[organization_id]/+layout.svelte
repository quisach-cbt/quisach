<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Head2, Head5 } from '$lib/components/ui/heading';
	import { Users, LogOut } from '@lucide/svelte';
	import { TabSwitch } from '$lib/components/ui/tabswitch';
	import { page } from '$app/state';
	import { Building, Home } from '@lucide/svelte';
	import { Modal } from '$lib/components/ui/modal';
	import { goto } from '$app/navigation';
	import { Avatar } from '$lib/components/ui/avatar';
	import { Input } from '$lib/components/ui/input';
	import { TextArea } from '$lib/components/ui/textarea';
	import parseMarkdown from '$lib/markdown_parsers/post';
	import { onMount } from 'svelte';

	let { children, data } = $props();
	let { organization, memberStatus, isAdmin, currentUserLoadMember } = data;
	let status = $state(memberStatus);
	let leaveOrgOpen = $state(false);
	let createPostModalOpen = $state(false);
	let errors = $state({
		title: '',
		content: ''
	});

	let activeTab = $state(0);
	const tabs = (() => {
		const baseTabs = [
			{ label: 'Overview', href: `/organizations/${organization.id}` },
			{ label: 'Members', href: `/organizations/${organization.id}/members` },
			{ label: 'Problems', href: `/organizations/${organization.id}/problems` }
		];

		if (isAdmin) {
			baseTabs.push(
				{ label: 'Join Requests', href: `/organizations/${organization.id}/join-requests` },
				{ label: 'Settings', href: `/organizations/${organization.id}/settings` }
			);
		}

		return baseTabs.map((tab, index) => {
			return {
				...tab,
				isActive: index === activeTab
			};
		});
	})();

	for (let i = 0; i < tabs.length; i++) {
		if (page.url.pathname === tabs[i].href) {
			activeTab = i;
			break;
		}
	}

	const usedStorage = organization.storageUsage ?? 0;
	const totalStorage = organization.storageLimit ?? 0;
	const storagePercent = Math.min((usedStorage / totalStorage) * 100, 100);
	function formatGB(val: number | string) {
		return (Number(val) / 1024 / 1024).toFixed(2);
	}

	async function sendJoinRequest() {
		const response = await fetch(`/api/orgs/requests/send`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				orgId: organization.id
			})
		});

		if (response.status === 200) {
			status = 'pending';
		} else {
			const error = await response.json();
			status = 'failed';
			console.error('Error sending join request:', error);
		}
	}

	async function leaveOrganization() {
		const response = await fetch(`/api/orgs/leaveOrg`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: currentUserLoadMember?.id
			})
		});
		if (response.status === 200) {
			goto(`/organizations`);
		} else {
			return;
		}
	}

	let postTitle = $state('');
	let postContent = $state('');
	let renderContent = $state('');

	onMount(async () => {
		try {
			renderContent = await parseMarkdown(postContent);
		} catch (error) {
			console.error('Error parsing markdown:', error);
		}
	});

	async function updatePreview() {
		parseMarkdown(postContent)
			.then((parsed) => {
				renderContent = parsed;
			})
			.catch((error) => {
				console.error('Error parsing markdown:', error);
			});
	}

	async function handleCreatePost() {
		try {
			const formData = new FormData();
			formData.append('title', postTitle);
			formData.append('content', postContent);
			formData.append('organizationId', organization.id);
			const response = await fetch(`/api/orgs/createPost`, {
				method: 'POST',
				body: formData
			});
			if (!response.ok) {
				const error = await response.json();
				console.error('Error creating post:', error);
				return;
			}
		} catch (err) {
			console.error('Error creating post:', err);
		} finally {
			createPostModalOpen = false;
			resetForm();
		}
	}

	async function resetForm() {
		postTitle = '';
		postContent = '';
		renderContent = '';
	}
</script>

<svelte:head>
	<title>{organization.name} | BTOI</title>
</svelte:head>

<div class="relative w-full overflow-hidden rounded-2xl bg-white shadow-lg">
	<div class="from-primary/70 relative h-56 bg-gradient-to-r to-blue-400/60">
		{#if organization.bannerUrl}
			<img
				src={organization.bannerUrl}
				alt="Banner"
				class="absolute inset-0 h-full w-full object-cover"
			/>
		{/if}

		<div
			class="absolute bottom-0 left-12 flex h-32 w-32 translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-xl"
		>
			{#if organization.logoUrl}
				<img src={organization.logoUrl} alt="Avatar" class="h-full w-full object-cover" />
			{:else}
				<span class="text-primary text-5xl font-bold"
					>{organization.name?.charAt(0).toUpperCase()}</span
				>
			{/if}
		</div>
	</div>

	<div
		class="flex flex-col items-start justify-between gap-8 px-12 pt-4 pb-6 md:flex-row md:items-center"
	>
		<div class="ml-36 min-w-0 flex-1">
			<Head2 class="truncate font-bold">{organization.name}</Head2>
			<div class="font-body mt-1 mb-2 flex flex-wrap truncate text-gray-500">
				{organization.description ?? 'No description provided.'}
			</div>
			<div class="flex items-center gap-3 text-base text-gray-500">
				<Users size={20} />
				<span
					>{organization._count?.OrganizationMember || 0}
					{organization._count?.OrganizationMember !== 1 ? 'members' : 'member'}</span
				>
				<span class="text-gray-400">•</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-at-sign"
					><circle cx="12" cy="12" r="4" /><path
						d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"
					/></svg
				>
				<span>{organization.id}</span>
			</div>
		</div>
		{#if page.data.currentUser}
			{#if status === 'member'}
			<div class="mt-4 flex-shrink-0 md:mt-0">
					<Modal title="Leave Organization" bind:isOpen={leaveOrgOpen}>
						{#snippet trigger()}
							<Button
								variant="outline"
								class="flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
								onclick={() => (leaveOrgOpen = true)}
							>
								<LogOut size={18} />
								Leave Organization
							</Button>
						{/snippet}
	
						{#snippet content()}
							<p class="text-sm text-gray-600">
								Are you sure you want to leave this organization? You will lose access to all resources and
								data associated with it.
							</p>
						{/snippet}
	
						{#snippet footer()}
							<Button variant="outline" onclick={() => (leaveOrgOpen = false)}>Cancel</Button>
							<Button variant="destructive" class="bg-red-500 text-white" onclick={() => leaveOrganization()}>
								Leave Organization
							</Button>
						{/snippet}
					</Modal>
				</div>
			{:else if status === 'pending'}
				<div class="mt-4 flex-shrink-0 md:mt-0">
					<Button variant="default" disabled class="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-clock"
						>
							<circle cx="12" cy="12" r="10" />
							<polyline points="12 6 12 12 16 14" />
						</svg>
						Join request sent
					</Button>
				</div>
			{:else if status === 'failed'}
				<div class="mt-4 flex-shrink-0 md:mt-0">
					<Button variant="default" disabled class="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-alert-circle"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						Failed to send request
					</Button>
				</div>
			{:else}
				<div class="mt-4 flex-shrink-0 md:mt-0">
					<Button
						variant="default"
						onclick={() => sendJoinRequest()}
						class="flex items-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-user-plus"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<line x1="19" y1="8" x2="19" y2="14" />
							<line x1="16" y1="11" x2="22" y2="11" />
						</svg>
						Join Organization
					</Button>
				</div>
			{/if}
		{/if}
	</div>

	{#if page.data.currentUser}
		{#if status === 'member'}
			<div class="px-12 pb-8">
				<div class="mb-2 flex items-center justify-between text-xs text-gray-500">
					<span class="flex items-center gap-1 font-medium">
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
							><rect x="3" y="7" width="18" height="13" rx="2" fill="#e5e7eb" /><rect
								x="7"
								y="3"
								width="10"
								height="4"
								rx="1"
								fill="#e5e7eb"
							/></svg
						>
						Storage
					</span>
					<span>
						{formatGB(usedStorage)} GB / {formatGB(totalStorage)} GB used
					</span>
				</div>
				<div class="h-3 w-full overflow-hidden rounded-full bg-gray-200">
					<div
						class="bg-primary h-full transition-all duration-500"
						style={`width: ${storagePercent}%`}
					></div>
				</div>
			</div>
			<div class="px-12">
				<div class="mb-2 flex items-center justify-between text-xs text-gray-500">
					<TabSwitch {tabs} active={activeTab} />
					<div class="flex items-center gap-2">
						{#if isAdmin && activeTab === 0}
							<Button onclick={() => (createPostModalOpen = true)}>Create Post</Button>
						{/if}
					</div>
				</div>
				{@render children()}
			</div>
		{:else}
			<div class="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
				<div class="w-full max-w-xl rounded-lg bg-white p-8 shadow-lg">
					<div class="mb-6">
						<Users size={80} class="text-primary mx-auto mb-4 animate-bounce" />
						<h2 class="text-2xl font-bold">Access Denied</h2>
						<div class="mt-2 text-gray-500">You do not have permission to access this page.</div>
					</div>

					<div class="mb-8 rounded-md bg-gray-50 p-4 text-left">
						<h4 class="mb-2 text-lg font-semibold">Error Details</h4>
						<p class="text-sm text-gray-600">
							<span class="font-medium">Message:</span> You need to be a member of this organization
							to access this page.
						</p>
					</div>

					<div class="space-y-4">
						<p class="text-sm text-gray-500">Here are some things you can try:</p>
						<div class="flex flex-col justify-center gap-3 sm:flex-row">
							<Button variant="default" href="/organizations" class="flex items-center gap-2"
								><Building size={18} /> Explore the Organization</Button
							>
							<Button variant="outline" href="/home" class="flex items-center gap-2"
								><Home size={18} /> Return to Homepage</Button
							>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{:else}
		<div class="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
			<div class="w-full max-w-xl rounded-lg bg-white p-8 shadow-lg">
				<div class="mb-6">
					<Users size={80} class="text-primary mx-auto mb-4 animate-bounce" />
					<h2 class="text-2xl font-bold">Access Denied</h2>
					<div class="mt-2 text-gray-500">You do not have permission to access this page.</div>
				</div>

				<div class="mb-8 rounded-md bg-gray-50 p-4 text-left">
					<h4 class="mb-2 text-lg font-semibold">Error Details</h4>
					<p class="text-sm text-gray-600">
						<span class="font-medium">Message:</span> You need to be logged in to access this page.
					</p>
				</div>

				<div class="space-y-4">
					<p class="text-sm text-gray-500">Here are some things you can try:</p>
					<div class="flex flex-col justify-center gap-3 sm:flex-row">
						<Button variant="default" href="/signin" class="flex items-center gap-2"
							><Users size={18} /> Sign In</Button
						>
						<Button variant="outline" href="/home" class="flex items-center gap-2"
							><Home size={18} /> Return to Homepage</Button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- <Modal title="Create Post" bind:isOpen={createPostModalOpen} size="xl">
	{#snippet children()}
		<div class="flex flex-col gap-4">
			<div class="mb-4 flex items-center gap-3">
				<div
					class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-200"
				>
					<Avatar src={data.currentUser?.avatarUrl} alt={data.currentUser?.displayName} size="lg" />
				</div>
				<div class="flex flex-col">
					<Head5>{data.currentUser?.displayName}</Head5>
					<div class="flex items-center gap-1 text-xs text-gray-500">
						<a href={`/user/${data.currentUser?.username}`} class="font-medium hover:underline"
							>@{data.currentUser?.username}</a
						>
					</div>
				</div>
				{#if isAdmin}
					<span class="bg-primary/20 text-primary ml-auto rounded px-2 py-1 text-xs">Admin</span>
				{/if}
			</div>

			<div class="flex flex-col gap-4">
				<div class="space-y-2">
					<label for="post-title" class="font-medium">
						Title <span class="text-red-500">*</span>
					</label>
					<Input
						id="post-title"
						type="text"
						placeholder="Enter post title"
						bind:value={postTitle}
					/>
					{#if errors.title}
						<p class="mt-1 text-xs text-red-500">{errors.title}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<label for="post-content" class="font-medium">
						Content <span class="text-red-500">*</span>
					</label>
					<TextArea
						id="post-content"
						placeholder="Write something..."
						rows={6}
						bind:value={postContent}
						oninput={updatePreview}
					></TextArea>
					{#if errors.content}
						<p class="mt-1 text-xs text-red-500">{errors.content}</p>
					{/if}
					<p class="mt-1 text-xs text-gray-500">Markdown formatting is supported</p>
				</div>

				<div class="mt-1 text-xs font-medium text-gray-500">
					<p>Preview:</p>
				</div>
				<div
					class="markdown-preview max-h-[250px] overflow-y-auto rounded-md border p-4 text-gray-600"
				>
					{@html renderContent}
				</div>
			</div>
		</div>
	{/snippet}

	{#snippet footer()}
		<Button
			variant="outline"
			onclick={() => {
				resetForm();
				createPostModalOpen = false;
			}}
		>
			Cancel
		</Button>
		<Button onclick={handleCreatePost}>Create Post</Button>
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
</style>
