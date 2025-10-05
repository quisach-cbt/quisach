<script lang="ts">
  import { Avatar } from '$lib/components/ui/avatar';
  import { Head2, Head4, Head5 } from '$lib/components/ui/heading';
  import { Dialog } from '$lib/components/ui/dialog';
  import { MoreHorizontal, Heart, MessageCircle, Repeat2, User, Clock } from '@lucide/svelte';
  import { cn } from '$lib/utils';
  import parseMarkdown from '$lib/markdown_parsers/post';
	import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { TextArea } from '$lib/components/ui/textarea';

  let { 
    post = $bindable()
  } = $props();
  
  let isReposted = $state(false);
  let isLiked = $state(false);
  let renderContent = $state('');
  let commentContent = $state('');
  let isLoading = $state(true);
  
  async function toggleLike() {
    isLiked = !isLiked;
    const formData = new FormData();
    formData.append('postId', post.id);
    formData.append('like', isLiked ? 'true' : 'false');
    try {
      const response = await fetch(`/api/posts/reaction`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.error) {
        console.error('Error toggling like:', data.error);
      } else {
        post._count.reactions = isLiked ? (post._count.reactions ?? 0) + 1 : (post._count.reactions ?? 0) - 1;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      isLiked = !isLiked;
    }
  }

  async function handleRepost() {
    isReposted = !isReposted;
    const formData = new FormData();
    formData.append('postId', post.id);
    formData.append('repost', isReposted ? 'true' : 'false');
    try {
      const response = await fetch(`/api/posts/repost`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.error) {
        console.error('Error reposting:', data.error);
      } else {
        post._count.reposts = isReposted ? (post._count.reposts ?? 0) + 1 : (post._count.reposts ?? 0) - 1;
      }
    } catch (error) {
      console.error('Error reposting:', error);
      isReposted = !isReposted;
    }
  }

  function getRelativeTime(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`; 
    if (minutes > 0) return `${minutes} minutes ago`;
    return 'Just now';
  }

  onMount(() => {
    (async () => {
      isLoading = true;
      try {
        renderContent = await parseMarkdown(post.content);
      } catch (error) {
        console.error('Error parsing markdown:', error);
      }

      try {
        const formData = new FormData();
        formData.append('postId', post.id);
        const reponse = await fetch(`/api/posts/userDetail`,{
          method: 'POST',
          body: formData,
        });
        const data = await reponse.json();
        if (data.error) {
          console.error('Error fetching user details:', data.error);
        } else {
          isLiked = data.isLiked;
          isReposted = data.isReposted;
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
      } finally {
        isLoading = false;
      }
    })();
  });
</script>

<div class="min-w-[500px] max-w-[800px] w-full bg-white rounded-lg shadow-lg p-4">
  <div class="flex items-center gap-3 mb-4">
    <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
      {#if post.author.avatarUrl && post.author.avatarUrl !== ''}
        <Avatar src={post.author.avatarUrl} alt={post.authorId} />
      {:else}
        <User class="w-6 h-6 text-gray-400" />
      {/if}
    </div>
    <div class="flex flex-col">
      <Head5>{post.author.displayName}</Head5>
      <div class="flex items-center gap-1 text-xs text-gray-500">
        <a href={`/user/${post.author.username}`} class="font-medium hover:underline">@{post.author.username}</a>
        <Clock size={12} />
        <span>{post.createdAt instanceof Date ? getRelativeTime(post.createdAt) : post.createdAt}</span>
      </div>
    </div>
    {#if post.pinned}
      <span class="ml-auto px-2 py-1 text-xs bg-primary/20 text-primary rounded-full mr-4">Pinned</span>
      
    {/if}
    <!-- <button class="p-2 hover:bg-gray-100 rounded-full ml-auto">
      <MoreHorizontal class="w-5 h-5 text-gray-600" />
    </button> -->
  </div>

  <div class="mb-4">
    <Head4>{post.title}</Head4>
    <div class='markdown-preview text-gray-600'>
      {@html renderContent}
    </div>
  </div>

  <div class="flex items-center mt-auto gap-4">
    {#if isLoading}
      <div class="flex-1 flex justify-center my-2">
        <div class="flex space-x-1">
          {#each Array(5) as _, i}
            <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: {i * 0.1}s"></div>
          {/each}
        </div>
      </div>
    {:else}
      <button 
        class={cn(
          "flex items-center gap-1 hover:text-primary transition-colors",
          isLiked && "text-primary"
        )}
        onclick={toggleLike}
      >
        <Heart size={20} />
        <span>{post._count.reactions ?? 0}</span>
      </button>
      <button class="flex items-center gap-1 hover:text-primary transition-colors">
        <MessageCircle size={20} />
        <span>{post._count.comments ?? 0}</span>
      </button>
      <button 
        class={cn(
          "flex items-center gap-1 hover:text-primary transition-colors",
          isReposted && "text-primary"
        )}
        onclick={handleRepost}
      >
        <Repeat2 size={20} />
        <span>{post._count.reposts ?? 0}</span>
      </button>
    {/if}
  </div>

  <div class="mt-4 pt-4 border-t">
    <div class="flex items-start gap-2">
    {#if page.data.currentUser}
      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {#if page.data.currentUser.avatarUrl}
          <Avatar src={page.data.currentUser.avatarUrl} alt="Current user" />
        {:else}
          <User class="w-5 h-5 text-gray-400" />
        {/if}
      </div>
      <div class="flex-1 rounded-full bg-gray-100 px-4 py-2">
        <TextArea
          placeholder='Write a comment...'
          rows={1}
          bind:value={commentContent}
        />
      </div>
      {:else}
      <p class="text-gray-500 text-sm">
        You need to be logged in to comment.
      </p>
      {/if}
    </div>
  </div>
</div>

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
    font-family: "Lexend";
  }
</style>
