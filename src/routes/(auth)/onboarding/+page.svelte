<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { TextArea } from '$lib/components/ui/textarea';
  import { Select } from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

  let { data } = $props();
  let {
    userid = '',
    redirectTo = '/home'
  } = data;

  let displayName = $state('');
  let gender = $state('');
  let location = $state('');
  let pronouns = $state('');
  let bio = $state('');
  let website = $state('');
  let avatarUrl = $state('');
  let avatarFile: File | null = $state(null);
  let formError = $state('');
  let isLoading = $state(false);
  let animationComplete = $state(false);

  const genders = [
      { value: 'MALE', label: 'Male' },
      { value: 'FEMALE', label: 'Female' },
      { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' }
  ];

  async function handleAvatarChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    const selectedFile = files ? files[0] : null;
    if (!selectedFile) {
      formError = 'Please select an image file';
      return;
    }
    if (!selectedFile.type.startsWith('image/')) {
      formError = 'Please select a valid image file';
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      formError = 'Image size exceeds 10MB';
      return;
    }
    if (selectedFile.size < 10 * 1024) {
      formError = 'Image size is too small';
      return;
    }
    avatarFile = selectedFile;
    avatarUrl = URL.createObjectURL(selectedFile);
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    isLoading = true;
    formError = '';
    try {
      const formData = new FormData();
      
      formData.append('userid', userid);
      formData.append('displayName', displayName);
      formData.append('gender', gender);
      formData.append('location', location);
      formData.append('pronouns', pronouns);
      formData.append('bio', bio);
      formData.append('website', website);
      
      if (avatarFile) {
        console.log('Attaching avatar file:', avatarFile.name, avatarFile.type, avatarFile.size);
        formData.append('avatar', avatarFile);
      } else {
        console.log('No avatar file to attach');
      }
      
      const response = await fetch('/onboarding', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        formError = error.message ?? 'Failed to save profile';
        return;
      }

      const data = await response.json();

      if (data.error) {
        formError = data.error;
        return;
      }

      await goto(redirectTo || '/home');
    } catch (e: any) {
      formError = e.message || 'Failed to save profile';
      console.error('Error:', e);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    setTimeout(() => {
      animationComplete = true;
    }, 500);
  });
</script>

<svelte:head>
  <title>Complete Your Profile | BTOI</title>
</svelte:head>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-br bg-primary/0">
  <div class="w-full max-w-3xl p-8 mx-auto bg-white rounded-lg shadow-lg">
    <div class="flex flex-col md:flex-row gap-8">
      <div class="md:w-1/3 text-center md:text-left">
        <div class="flex justify-center md:justify-start mb-6">
            <div class="relative rounded-full bg-primary/10 p-4 w-24 h-24 flex items-center justify-center overflow-hidden">
            {#if avatarUrl}
              <img 
              src={avatarUrl} 
              alt="Profile avatar" 
              class="absolute inset-0 w-full h-full object-cover" 
              />
            {:else}
              <svg 
              class="setup-icon w-12 h-12 text-primary"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              >
              <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" 
                  stroke-dasharray="64" 
                      stroke-dashoffset={animationComplete ? "0" : "64"} 
                      style="transition: stroke-dashoffset 0.8s cubic-bezier(0.65, 0, 0.45, 1) 0.2s"/>
                <path d="M9 12l2 2l4-4" 
                      stroke-dasharray="20" 
                      stroke-dashoffset={animationComplete ? "0" : "20"} 
                      style="transition: stroke-dashoffset 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.8s"/>
              </svg>
            {/if}
          </div>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-800 mb-2">
          Complete Your Profile
        </h1>
        
        <p class="text-lg text-gray-600 mb-6 font-medium">
          Tell us a bit about yourself to get started
        </p>
        
        <div class="hidden md:block mt-8">
          <p class="text-sm font-body text-gray-500">
            Setting up your profile helps us personalize your BTOI experience and connect you with relevant challenges.
          </p>
        </div>
      </div>
      
      <div class="md:w-2/3">
        {#if formError}
          <div class="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm text-center">{formError}</div>
        {/if}
        
        <form class="space-y-5" onsubmit={handleSubmit} use:enhance>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for='check' class="block text-sm font-medium text-gray-700 mb-1">Display Name<span class="text-red-600">*</span></label>
              <Input 
                name="displayName" 
                bind:value={displayName} 
                placeholder="Display Name"
              />
            </div>
            
            <div>
              <label for='check' class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Select 
                value={gender} 
                options={genders} 
                placeholder="Select your gender" 
                onChange={(value) => {
                  gender = value
                }}
              />
            </div>
            
            <div>
              <label for='check' class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Input 
                name="location" 
                bind:value={location} 
                placeholder="Your location" 
              />
            </div>
            
            <div>
              <label for='check' class="block text-sm font-medium text-gray-700 mb-1">pronouns</label>
              <Input 
                name="pronouns" 
                bind:value={pronouns} 
                placeholder="e.g. he/him, she/her" 
              />
            </div>
            
            <div class="md:col-span-2">
              <label for='check' class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <TextArea 
                name="bio" 
                bind:value={bio} 
                placeholder="Tell us about yourself" 
                rows={3} 
              />
            </div>
            
            <div>
              <label for='check' class="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <Input 
                name="website" 
                type="url" 
                bind:value={website} 
                placeholder="https://yourwebsite.com" 
              />
            </div>
            
            <div>
              <label for='check' class="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
              <input 
                type="file" 
                accept="image/*" 
                onchange={handleAvatarChange} 
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/60 file:text-white hover:file:bg-primary/80" 
              />
            </div>
          </div>
          
          <Button 
            variant='default'
            type="submit" 
            class="w-full" 
            disabled={isLoading}>
            {#if isLoading}Saving...{:else}Save and Continue{/if}
          </Button>
        </form>
        
        <div class="mt-8 border-t border-gray-100 pt-6 block md:hidden">
          <p class="text-sm text-gray-500">
            Setting up your profile helps us personalize your BTOI experience and connect you with relevant challenges.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .setup-icon {
    transform-origin: 50% 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
</style>