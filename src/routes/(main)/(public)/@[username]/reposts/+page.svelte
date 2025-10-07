<script lang='ts'>
  import { Post, PostDialog } from "$lib/components/features/post";
  import { Dialog } from "$lib/components/ui/dialog";

  const { data } = $props();
  const { user } = $state(data);
</script>

<div class='flex flex-col gap-4 mt-4'>
  {#each user.reposts as post}
    <Dialog>
      {#snippet trigger()}
      <Post post={post.post} />
      {/snippet}
      {#snippet content()}
      <PostDialog post={post.post} />
      {/snippet}
    </Dialog>
  {/each}
</div>