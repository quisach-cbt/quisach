<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  

  let { data } = $props();
  let { 
    username = '', 
    redirectTo = '/onboarding', 
  } = data;

  let redirectDelay = 5000;
  
  let animationComplete = $state(false);
  let countdown = $derived(redirectDelay / 1000);
  
  onMount(() => {
    setTimeout(() => {
      animationComplete = true;
    }, 500);
    
    const timer = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        clearInterval(timer);
        goto(redirectTo);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  });
  
  function handleContinue() {
    goto(redirectTo);
  }
</script>

<svelte:head>
  <title>Account Setup | BTOI</title>
</svelte:head>

<div class="flex items-center justify-center min-h-screen bg-primary/0">
  <div class="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg text-center">
    <div class="flex justify-center mb-6">
      <div class="relative rounded-full bg-primary/10 p-4 w-24 h-24 flex items-center justify-center">
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
          <path d="M12 8v4l3 3" 
                stroke-dasharray="20" 
                stroke-dashoffset={animationComplete ? "0" : "20"} 
                style="transition: stroke-dashoffset 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.8s"/>
        </svg>
      </div>
    </div>
    
    <h1 class="text-2xl font-bold text-gray-800 mb-2">
      Almost There!
    </h1>
    
    <p class="text-lg text-gray-600 mb-4">
      {#if username}
        Hi {username}, let's set up your account.
      {:else}
        Let's set up your account.
      {/if}
    </p>
    
    <p class="text-sm text-gray-500 mb-6">
      You need to complete your profile information before you can start using all BTOI features.
    </p>
    
    <div class="flex flex-col gap-3">
      <Button 
        variant="default"
        class="w-full"
        onclick={handleContinue}
      >
        Continue to Profile Setup
      </Button>
      
      <p class="text-xs text-gray-400">
        Redirecting to setup page in {countdown} seconds...
      </p>
    </div>
    
    <div class="mt-8 border-t border-gray-100 pt-6">
      <p class="text-sm text-gray-500">
        Setting up your profile helps us personalize your BTOI experience and connect you with relevant challenges.
      </p>
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
