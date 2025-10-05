<script lang="ts">
	import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
  <title>Invitation Not Found | BTOI</title>
</svelte:head>

<div class="w-full flex items-center justify-center min-h-screen bg-gray-50">
  <div class="w-full max-w-md p-8 mx-auto space-y-6 bg-white rounded-lg shadow-md text-center">
    <h1 class="text-2xl font-bold text-gray-800">Invitation Not Found</h1>

    <p class="font-body text-lg text-gray-600">
      The invitation link you are trying to access is either invalid or has expired.
    </p>

    {#if page.error?.message}
      <p class="font-body text-sm text-red-600 bg-red-100 p-3 rounded-md">
        Error: {page.error.message}
      </p>
    {/if}

    <p class="font-body text-sm text-gray-500">
      Please check the link or contact the person who invited you for a new one.
    </p>

    <div class='border-t border-gray-100 pt-4'>
      <Button
        variant="default"
        class="w-full"
        onclick={() => {
          goto('/home');
        }}
      >Go back to home</Button>
    </div>
  </div>
</div>
