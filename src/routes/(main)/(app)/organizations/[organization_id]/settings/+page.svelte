<script lang='ts'>
  import { Head4 } from "$lib/components/ui/heading";
  import { Select } from "$lib/components/ui/select";
  import { Input } from "$lib/components/ui/input";
  import { TextArea } from "$lib/components/ui/textarea";
  import { Button } from "$lib/components/ui/button";
  import { Avatar } from "$lib/components/ui/avatar";
  import { formatDate, cn } from "$lib/utils";
  import { Trash2, Upload, AlertCircle } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { onMount } from 'svelte';
  import { Modal } from "$lib/components/ui/modal";

  let { data } = $props();
  let {
    organization,
    inviteLinks
  } = data;
  
  let formError = $state('');
  let isProcessing = $state(false);
  let createLinkModalOpen = $state(false);
  let selectedExpiration = $state('');
  let newInviteLink = $state('');
  let deleteOrgModalOpen = $state(false);
  let verifyDeleteOrg = $state('');
  
  let id = $state(organization?.id || '');
  let name = $state(organization?.name || '');
  let description = $state(organization?.description || '');
  let logoUrl = $state(organization?.logoUrl || '');
  let bannerUrl = $state(organization?.bannerUrl || '');
  let logoFile: File | null = $state(null);
  let bannerFile: File | null = $state(null);
  let logoPreview = $state(organization?.logoUrl || '');
  let bannerPreview = $state(organization?.bannerUrl || '');
  let website = $state(organization?.website || '');
  let isDraggingLogo = $state(false);
  let isDraggingBanner = $state(false);
  let isEditLoading = $state(false);
  
  const expirationOptions = [
    { value: '1', label: '1 day' },
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' }
  ];
  
  async function handleFileUpload(event: Event, type: 'logo' | 'banner') {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      formError = 'Please select a valid image file';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      formError = 'Image size exceeds 5MB';
      return;
    }

    if (type === 'logo') {
      logoFile = file;
      logoUrl = URL.createObjectURL(file);
      logoPreview = URL.createObjectURL(file);
    } else {
      bannerFile = file;
      bannerUrl = URL.createObjectURL(file);
      bannerPreview = URL.createObjectURL(file);
    }
  }

  function handleDragOver(event: DragEvent, type: 'logo' | 'banner') {
    event.preventDefault();
    if (type === 'logo') {
      isDraggingLogo = true;
    } else {
      isDraggingBanner = true;
    }
  }

  function handleDragLeave(event: DragEvent, type: 'logo' | 'banner') {
    event.preventDefault();
    if (type === 'logo') {
      isDraggingLogo = false;
    } else {
      isDraggingBanner = false;
    }
  }

  function handleDrop(event: DragEvent, type: 'logo' | 'banner') {
    event.preventDefault();
    if (type === 'logo') {
      isDraggingLogo = false;
    } else {
      isDraggingBanner = false;
    }

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      formError = 'Please select a valid image file';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      formError = 'Image size exceeds 5MB';
      return;
    }

    if (type === 'logo') {
      logoFile = file;
      logoUrl = URL.createObjectURL(file);
      logoPreview = URL.createObjectURL(file);
    } else {
      bannerFile = file;
      bannerUrl = URL.createObjectURL(file);
      bannerPreview = URL.createObjectURL(file);
    }
  }

  async function handleUpdateOrg() {
    isEditLoading = true;

    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('description', description);
    if (logoFile) formData.append('logoFile', logoFile);
    if (bannerFile) formData.append('bannerFile', bannerFile);
    formData.append('website', website ?? '');

    try {
      const response = await fetch(`/api/orgs/update`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.status !== 200) {
        formError = data.message ?? 'Failed to update organization';
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      formError = 'An error occurred while updating the organization';
    } finally {
      isEditLoading = false;
    }
  }
  
  async function handleDeleteLink(linkId: string) {
    isProcessing = true;
    try {
      const response = await fetch(`/api/orgs/invite-links/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ linkId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        formError = errorData.message || 'Failed to delete invite link';
        return;
      }
    } catch (error) {
      console.error('Error deleting invite link:', error);
      formError = 'An error occurred while deleting the invite link';
    } finally {
      isProcessing = false;
    }
  }
  
  async function handleCreateInviteLink() {
    isProcessing = true;
    try {
      const expiresIn = new Date();
      expiresIn.setDate(expiresIn.getDate() + parseInt(selectedExpiration));
      
      const response = await fetch(`/api/orgs/invite-links/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          organizationId: organization?.id,
          expiresIn: expiresIn.toISOString()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        formError = errorData.message || 'Failed to create invite link';
        return;
      }
      createLinkModalOpen = false;
      newInviteLink = await response.json();
    } catch (error) {
      console.error('Error creating invite link:', error);
      formError = 'An error occurred while creating the invite link';
    } finally {
      isProcessing = false;
    }
  }

  async function handleDeleteOrg() {
    if (verifyDeleteOrg !== `delete/${organization?.id}`) {
      formError = 'Please type "delete/{organization_id}" to confirm.';
      return;
    }

    try {
      const response = await fetch(`/api/orgs/deleteOrg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orgId: organization?.id })
      })
      if (response.status === 200) {
        goto('/organizations');
      } else {
        const errorData = await response.json();
        formError = errorData.message ?? 'Failed to delete organization';
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      formError = 'An error occurred while deleting the organization';
    } finally {
      deleteOrgModalOpen = false;
      verifyDeleteOrg = '';
    }
  }
  
  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('modal-backdrop')) {
      createLinkModalOpen = false;
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && createLinkModalOpen) {
      createLinkModalOpen = false;
    }
  }
  
  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class='flex flex-col gap-4 mt-4'>
  {#if formError}
    <div class="p-3 text-sm text-red-700 border border-red-200 rounded-md bg-red-50 mb-2">
      {formError}
    </div>
  {/if}

  <div class="flex items-center justify-between">
    <Head4>Invite links</Head4>
    <Button 
      variant="default" 
      onclick={() => {
        createLinkModalOpen = true;
        selectedExpiration = 'never';
      }}
    >
      Generate New Invite Link
    </Button>
  </div>
  
  <div class="relative z-10 overflow-x-auto">
    {#if !inviteLinks || inviteLinks.length === 0}
      <div class="p-4 text-center text-gray-500 border border-gray-200 rounded-md">
        No invite links available. Create a new one to invite members to your organization.
      </div>
    {:else}
      <div class="inline-block min-w-full rounded-lg border border-gray-200 shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="rounded-t-lg bg-gray-100 font-bold text-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs text-gray-500 uppercase first:rounded-tl-lg">
                Link
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                Created by
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                Expires
              </th>
              <th class="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                Refered Count
              </th>
              <th class="px-6 py-3 text-right text-xs text-gray-500 uppercase last:rounded-tr-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each inviteLinks as link, i}
              <tr class="transition-colors odd:bg-white even:bg-gray-50 hover:bg-gray-50 {i === inviteLinks.length - 1 ? 'last-row' : ''}">
                <td class="px-6 py-4 whitespace-nowrap {i === inviteLinks.length - 1 ? 'rounded-bl-lg' : ''}">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm text-gray-600 underline max-w-[200px] truncate">
                      {`https://btoi.info.vn/organizations/join/${link.id}`}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      class="p-1 h-7"
                      title="Copy invite link"
                      onclick={() => {
                        navigator.clipboard.writeText(`https://btoi.info.vn/organizations/join/${link.id}`);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                    </Button>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <Avatar 
                      size="sm"
                      src={link.user?.avatarUrl ?? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(link.user?.displayName ?? '')}
                      alt={link.user?.displayName ?? 'User'}
                    />
                    <span class="text-sm">{link.user?.displayName ?? 'Unknown user'}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  {link.expiredAt ? formatDate(link.expiredAt) : 'Never expires'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                  {link.joinAmount}
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap {i === inviteLinks.length - 1 ? 'rounded-br-lg' : ''}">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete invite link"
                    onclick={() => handleDeleteLink(link.id)}
                    disabled={isProcessing}
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <Head4>Organization Information</Head4>
  <div class="bg-white rounded-lg border border-gray-300 overflow-hidden">
    <div class="p-6 space-y-6">
      <div class="border-b border-gray-200 pb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label class='text-sm text-gray-700 space-y-1'>
            <div class='font-medium text-gray-700'>Organization ID</div>
            <Input
              class="font-body"
              name='id'
              type='text'
              value={organization?.id}
              readonly
              disabled
            />
            <p class="mt-1 text-xs font-body text-gray-500">Organization ID cannot be changed</p>
          </label>

          <label class='text-sm text-gray-700 space-y-1'>
            <div class='font-medium text-gray-700'>Name</div>
            <Input
              class='font-body'
              name='name'
              type='text'
              bind:value={name}
              placeholder='Enter organization name'
            />
          </label>
        </div>

        <div class="mt-5">
          <label for='description' class='block text-sm font-medium text-gray-700 mb-1'>Description</label>
          <TextArea
            name='description'
            bind:value={description}
            placeholder='Enter organization description'
            rows={3}
          />
        </div>
      </div>

      <div class="border-b border-gray-200 pb-6">
        <h4 class="text-lg font-medium mb-4">Branding</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label for='logoUrl' class='block text-sm font-medium text-gray-700 mb-1'>Logo</label>
            <input name='logoUrl' type='hidden' bind:value={logoUrl} />
            <div 
              class={cn('relative border-2 border-dashed rounded-md flex flex-col items-center justify-center h-40 transition-colors overflow-hidden', 
                isDraggingLogo ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50')}
              aria-label='Drag and drop logo here or click to upload'
              role='button'
              tabindex="0"
              ondragover={(e) => handleDragOver(e, 'logo')} 
              ondragleave={(e) => handleDragLeave(e, 'logo')} 
              ondrop={(e) => handleDrop(e, 'logo')}
            >
              {#if logoPreview}
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  class="h-full max-h-28 object-contain" 
                />
                <div class="absolute inset-0 bg-black/0 hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <button 
                    type="button" 
                    class="text-white text-sm font-medium" 
                    onclick={() => {
                      logoFile = null;
                      logoUrl = '';
                      logoPreview = '';
                    }}
                  >
                    Replace Image
                  </button>
                </div>
              {:else}
                <div class="p-6 flex flex-col items-center">
                  <div class="bg-primary/10 p-3 rounded-full mb-3">
                    <Upload size={20} class="text-primary" />
                  </div>
                  <p class="text-sm text-gray-500 text-center mb-2">Drag and drop your logo here or</p>
                  <div class="relative">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      class="border-primary text-primary hover:bg-primary/10"
                    >
                      Browse files
                    </Button>
                    <input 
                      name='logoFile'
                      type="file" 
                      accept="image/*" 
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onchange={(e) => handleFileUpload(e, 'logo')}
                    />
                  </div>
                  <p class="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 5MB</p>
                </div>
              {/if}
            </div>
            <p class="mt-1 text-xs text-gray-500">Recommended size: 512x512px</p>
          </div>

          <div>
            <label for='bannerUrl' class='block text-sm font-medium text-gray-700 mb-1'>Banner</label>
            <input name='bannerUrl' type='hidden' bind:value={bannerUrl} />
            <div 
              class={cn('relative border-2 border-dashed rounded-md flex flex-col items-center justify-center h-40 transition-colors overflow-hidden', 
                isDraggingBanner ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50')}
              aria-label='Drag and drop banner here or click to upload'
              role='button'
              tabindex="0"
              ondragover={(e) => handleDragOver(e, 'banner')} 
              ondragleave={(e) => handleDragLeave(e, 'banner')} 
              ondrop={(e) => handleDrop(e, 'banner')}
            >
              {#if bannerPreview}
                <img 
                  src={bannerPreview} 
                  alt="Banner preview" 
                  class="h-full w-full object-cover" 
                />
                <div class="absolute inset-0 bg-black/0 hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <button 
                    type="button" 
                    class="text-white text-sm font-medium" 
                    onclick={() => {
                      bannerFile = null;
                      bannerUrl = '';
                      bannerPreview = '';
                    }}
                  >
                    Replace Image
                  </button>
                </div>
              {:else}
                <div class="p-6 flex flex-col items-center">
                  <div class="bg-primary/10 p-3 rounded-full mb-3">
                    <Upload size={20} class="text-primary" />
                  </div>
                  <p class="text-sm text-gray-500 text-center mb-2">Drag and drop your banner here or</p>
                  <div class="relative">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      class="border-primary text-primary hover:bg-primary/10"
                    >
                      Browse files
                    </Button>
                    <input 
                      name='bannerFile'
                      type="file" 
                      accept="image/*" 
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onchange={(e) => handleFileUpload(e, 'banner')}
                    />
                  </div>
                  <p class="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 5MB</p>
                </div>
              {/if}
            </div>
            <p class="mt-1 text-xs text-gray-500">Recommended size: 1200x400px</p>
          </div>
        </div>
      </div>

      <div class="pb-2">
        <h4 class="text-lg font-medium mb-4">Contact Information</h4>
        <div>
          <label for='website' class='block text-sm font-medium text-gray-700 mb-1'>Website (Optional)</label>
          <Input
            name='website'
            type='url'
            bind:value={website}
            placeholder='https://example.com'
          />
        </div>
      </div>

      <div class="flex justify-end">
        <Button
          onclick={() => handleUpdateOrg()}
          disabled={isEditLoading}
        >
          {isEditLoading ? 'Updating...' : 'Update Organization'}
        </Button>
      </div>
    </div>
  </div>

  <Head4>Danger Zone</Head4>
  <div class='border border-gray-300 rounded-md p-4'>
    <p class='font-body text-sm text-gray-600'>
      You can delete your organization. This action is irreversible and will remove all associated data.
    </p>
    <Button 
      variant="destructive" 
      class="mt-4 text-white bg-red-500"
      onclick={() => {
        verifyDeleteOrg = '';
        deleteOrgModalOpen = true;
      }}
    >
      Delete Organization
    </Button>
  </div>
</div>

<Modal
  bind:isOpen={createLinkModalOpen}
  title='Generate Invite Link'
  size='md'
>
  {#snippet children()}
  <p class="text-sm text-gray-600">
    Create a new invite link for your organization. You can set an expiration time for the link or make it never expire.
  </p>
  
  <div class="space-y-2">
    <label for="expiration" class="block text-sm font-medium text-gray-700">Link Expiration</label>
    <Select 
      value={selectedExpiration}
      options={expirationOptions}
      placeholder="Select expiration time"
      onChange={(value) => selectedExpiration = value}
    />
  </div>
  {/snippet}

  {#snippet footer()}
    <Button 
      variant="outline" 
      onclick={() => createLinkModalOpen = false}
    >
      Cancel
    </Button>
    <Button 
      variant="default"
      onclick={handleCreateInviteLink}
      disabled={isProcessing}
    >
      {isProcessing ? 'Creating...' : 'Create Link'}
    </Button>
  {/snippet}
</Modal>

<Modal
  bind:isOpen={deleteOrgModalOpen}
  title="Delete Organization"
  size="md"
>
  {#snippet children()}
    <p class="text-sm text-gray-600">
      Are you sure you want to delete this organization? This action cannot be undone.
    </p>
    <p class="text-sm text-gray-600">
      Please type <strong>delete/{organization?.id}</strong> to confirm.
    </p>
    <Input 
      name="verifyDeleteOrg"
      type="text" 
      placeholder="Type delete/{organization?.id} to confirm"
      bind:value={verifyDeleteOrg}
    />
  {/snippet}

  {#snippet footer()}
    <Button 
      variant="outline" 
      onclick={() => deleteOrgModalOpen = false}
    >
      Cancel
    </Button>
    <Button 
      variant="destructive" 
      class="text-white bg-red-500"
      onclick={() => handleDeleteOrg()}
    >
      Delete Organization
    </Button>
  {/snippet}
</Modal>