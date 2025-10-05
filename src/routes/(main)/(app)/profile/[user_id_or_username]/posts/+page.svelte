<script lang='ts'>
	import { Head5 } from '$lib/components/ui/heading';
  import { Post, PostDialog } from "$lib/components/features/post";
  import { Dialog } from "$lib/components/ui/dialog";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";

  const { data } = $props();
  const { posts } = $state(data);

  let loading = $state(false);
  let container: HTMLElement | null = $state(null);

  async function loadPosts() {
    if (!data.nextCursor || loading) return;
    loading = true;
    await invalidate(`/api/posts?cursor=${data.nextCursor}`);
    loading = false;
  }

  onMount(() => {
    const observe = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadPosts();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (container) {
      observe.observe(container);
    }

    return () => {
      if (container) {
        observe.unobserve(container);
      }
    };
  })
</script>

<div class='flex flex-col gap-4 mt-4'>
  {#each posts as post, index}
    <Dialog>
      {#snippet trigger()}
      <Post post={post} />
      {/snippet}
      {#snippet content()}
      <PostDialog bind:post={posts[index]} />
      {/snippet}
    </Dialog>
  {/each}

  <div bind:this={container}>
    {#if data.nextCursor}
      <div class='flex items-center justify-center'>
        <p class='text-gray-500 text-sm'>
          Loading more posts...
        </p>
      </div>
    {:else}
      <div class='flex items-center justify-center'>
        <p class='text-gray-500 text-sm'>
          No more posts to load.
        </p>
      </div>
    {/if}
  </div>
</div>