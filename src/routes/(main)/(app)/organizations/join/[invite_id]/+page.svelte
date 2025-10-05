<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';

  let { data } = $props();
  let { inviteLink } = data;

  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let isExpired = inviteLink.expiredAt < new Date();

  async function handleAcceptInvite() {
    isLoading = true;
    error = null;

    try {
      const response = await fetch(`/api/orgs/invite-links/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteId: inviteLink.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to accept invitation. Please try again.' }));
        throw new Error(errorData.message || 'Failed to accept invitation.');
      }

      await goto(`/organizations/${inviteLink.organization.id}`);
    } catch (err: any) {
      console.error('Error accepting invitation:', err);
      error = err.message || 'An unexpected error occurred.';
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Join {inviteLink.organization.name} | BTOI</title>
</svelte:head>

<div class="w-full flex items-center justify-center min-h-screen bg-gray-50">
  <div class="w-full max-w-md p-8 mx-auto space-y-6 bg-white rounded-lg shadow-md text-center">
    {#if inviteLink.organization.logoUrl}
      <img src={inviteLink.organization.logoUrl} alt="{inviteLink.organization.name} Logo" class="w-20 h-20 mx-auto mb-4 rounded-full object-cover"/>
    {/if}

    <h1 class="text-2xl font-bold text-gray-800">
      You're Invited!
    </h1>

    <p class="font-body text-lg text-gray-600">
      You have been invited to join the organization:
      <span class="font-semibold">{inviteLink.organization.name}</span>
    </p>

    <p class="font-body text-sm text-gray-500">
      Invited by: {inviteLink.user.displayName} (@{inviteLink.user.username})
    </p>
    <p class="-mt-4 **:font-body text-sm text-gray-500">
      This invitation will expire on: {new Date(inviteLink.expiredAt).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}
    </p>

    {#if page.data.currentUser}
    {#if error}
      <p class="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
    {/if}

    <div class="pt-4">
      <Button
        variant="default"
        class="w-full"
        onclick={handleAcceptInvite}
        disabled={isLoading}
      >
        {#if isLoading}
          Accepting...
        {:else}
          Accept Invitation
        {/if}
      </Button>
    </div>

    <div class="mt-6 border-t border-gray-100 pt-4">
      <p class="font-body text-xs text-gray-500">
        By accepting this invitation, you will become a member of the {inviteLink.organization.name} organization on BTOI.
      </p>
    </div>
    {:else if isExpired}
      <p class="text-sm text-red-600 bg-red-100 p-3 rounded-md">
        This invitation has expired. Please contact the inviter for a new link.
      </p>
    {:else}
      <p class="text-sm text-gray-500">
        You need to log in to accept this invitation.
      </p>
      <Button
        variant="default"
        class="w-full mt-4"
        onclick={() => goto('/signin')}
      >Log In</Button>
    {/if}
  </div>
</div>
