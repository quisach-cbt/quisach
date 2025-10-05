<script lang="ts">
	import type { PageProps } from './$types';
	import { Post, PostDialog } from '$lib/components/features/post';
	import { Dialog } from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { RightSidebar } from '$lib/components/layout/navigations';
	import { Head2, Head5 } from '$lib/components/ui/heading';
	import { ChevronRight, LockIcon, GlobeIcon } from '@lucide/svelte';
	import { Modal } from '$lib/components/ui/modal';
	import { Avatar } from '$lib/components/ui/avatar';
	import { Input } from '$lib/components/ui/input';
	import { TextArea } from '$lib/components/ui/textarea';
	import { Select } from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { page } from '$app/state';

	let { data }: PageProps = $props();
	let { pinnedPosts, normalPosts } = $state(data);
	let createPostModalOpen = $state(false);

	let postTitle = $state('');
	let postContent = $state('');
	let isPinned = $state(false);
	let visibility = $state('PUBLIC');

	const visibilities = [
		{ label: 'Public', value: 'PUBLIC' },
		{ label: 'Private', value: 'PRIVATE' }
	];

	let errors = $state({
		title: '',
		content: ''
	});

	function validateForm() {
		let isValid = true;
		errors.title = '';
		errors.content = '';

		if (!postTitle.trim()) {
			errors.title = 'Title is required';
			isValid = false;
		}

		if (!postContent.trim()) {
			errors.content = 'Content is required';
			isValid = false;
		}

		return isValid;
	}

	async function handleCreatePost() {
		if (!validateForm()) return;

		try {
			const formData = new FormData();
			formData.append('title', postTitle);
			formData.append('content', postContent);
			formData.append('isPinned', isPinned ? 'on' : 'off');
			formData.append('visibility', visibility);

			const response = await fetch(`/api/posts/create`, {
				method: 'POST',
				body: formData
			});

			postTitle = '';
			postContent = '';
			isPinned = false;
			visibility = 'PUBLIC';

			if (!response.ok) {
				const errorData = await response.json();
				if (errorData.error) {
					throw new Error(errorData.error);
				}
			}

			const newPost = await response.json();
			if (isPinned) {
				pinnedPosts.unshift(newPost);
			} else {
				normalPosts.unshift(newPost);
			}

			createPostModalOpen = false;
		} catch (error) {
			console.error('Error creating post:', error);
		}
	}

	async function handleCreateDraft() {}

	function resetForm() {
		postTitle = '';
		postContent = '';
		isPinned = false;
		visibility = 'PUBLIC';
		errors.title = '';
		errors.content = '';
	}
</script>

<svelte:head>
	<title>Home | BTOI: Ben Tre Olympiad in Informatics</title>
</svelte:head>

<div class="flex grow gap-8 px-8 py-6">
	<div class="grow space-y-8 overflow-y-auto">
		<section class="relative space-y-4">
			<Head2>Home</Head2>
			<Button
				variant="link"
				href="/home/pinned"
				class="text-primary hover:text-primary/80 absolute top-0 right-0"
			>
				See all <ChevronRight class="h-4 w-4" />
			</Button>
			<div class="flex flex-nowrap gap-4 overflow-x-scroll pb-2">
				{#each pinnedPosts as post, index}
					<Dialog>
						{#snippet trigger()}
							<Post {post} />
						{/snippet}
						{#snippet content()}
							<PostDialog bind:post={pinnedPosts[index]} />
						{/snippet}
					</Dialog>
				{/each}
			</div>
		</section>

		<section class="relative space-y-4">
			<Head2>Feeds</Head2>
			{#if page.data.currentUser}
				<Modal title="Create Post">
					{#snippet trigger()}
						<Button class="absolute top-0 right-0">Create Post</Button>
					{/snippet}
					{#snippet content()}
						<div class="flex flex-col gap-4 w-full">
							<div class="mb-4 flex items-center gap-3">
								<div
									class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-200"
								>
									<Avatar
										src={data.currentUser?.avatarUrl}
										alt={data.currentUser?.displayName}
										size="lg"
									/>
								</div>
								<div class="flex flex-col">
									<Head5>{data.currentUser?.displayName}</Head5>
									<div class="flex items-center gap-1 text-xs text-gray-500">
										<a
											href={`/user/${data.currentUser?.username}`}
											class="font-medium hover:underline">@{data.currentUser?.username}</a
										>
									</div>
								</div>
								{#if data.currentUser?.role === 'ADMIN'}
									<span class="bg-primary/20 text-primary ml-auto rounded px-2 py-1 text-xs"
										>Admin</span
									>
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
									></TextArea>
									{#if errors.content}
										<p class="mt-1 text-xs text-red-500">{errors.content}</p>
									{/if}
									<p class="mt-1 text-xs text-gray-500">Markdown formatting is supported</p>
								</div>

								<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
									<!-- Visibility selector -->
									<div class="space-y-2">
										<label for="post-visibility" class="font-medium">Visibility</label>
										<Select
											value={visibility}
											options={visibilities}
											placeholder="Select visibility"
											onChange={(value) => {
												visibility = value;
											}}
										/>
										<p class="mt-1 text-xs text-gray-500">
											{visibility === 'PUBLIC'
												? 'Everyone can see this post'
												: 'Only you can see this post'}
										</p>
									</div>

									{#if data.currentUser?.role === 'ADMIN'}
										<div class="space-y-2">
											<div class="flex items-center justify-between">
												<label for="post-pinned" class="font-medium">Pin post</label>
												<Switch label="" bind:value={isPinned} />
											</div>
											<p class="mt-1 text-xs text-gray-500">
												{isPinned
													? 'This post will appear in the Featured section'
													: 'This post will appear in the Normal Posts section'}
											</p>
										</div>
									{/if}
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
						<Button variant="outline" onclick={handleCreateDraft}>Save Draft</Button>
						<Button onclick={handleCreatePost}>Create Post</Button>
					{/snippet}
				</Modal>
			{/if}
			<div class="flex flex-col gap-4">
				{#each normalPosts as post, index}
					<Dialog>
						{#snippet trigger()}
							<Post {post} />
						{/snippet}
						{#snippet content()}
							<PostDialog bind:post={normalPosts[index]} />
						{/snippet}
					</Dialog>
				{/each}
			</div>
		</section>
	</div>
	<RightSidebar />
</div>
