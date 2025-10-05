<script lang="ts">
    import { Head2 } from '$lib/components/ui/heading';
    import { Button } from '$lib/components/ui/button';
    import { goto } from '$app/navigation';
    import { Input } from '$lib/components/ui/input';
    import { cn } from '$lib/utils';
    import { enhance } from '$app/forms';

    let { form } = $props();

    let email = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let username = $state('');
    let isLoading = $state(false);
    let formError = $state();
    let passwordFeedback = $state();
    let passwordStrength = $state(0);
    
    function validatePassword(pass: string) {
        if (!pass) {
            passwordFeedback = '';
            return;
        }
        
        const hasMinLength = pass.length >= 8;
        const hasNumber = /\d/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        
        if (hasMinLength && hasNumber && hasLowerCase) {
            passwordStrength = 3;
            passwordFeedback = 'Password strength: Strong';
        } else if (hasMinLength && (hasNumber || hasLowerCase)) {
            passwordStrength = 2;
            passwordFeedback = 'Password strength: Medium';
        } else {
            passwordStrength = 1;
            passwordFeedback = 'Password should be at least 8 characters including a number and a lowercase letter';
        }
    }
    
    async function handleSubmit(event: SubmitEvent) {
      if (password !== confirmPassword) {
        event.preventDefault();
        formError = 'Passwords do not match';
        return;
      }
      
      if (passwordStrength < 2) {
        event.preventDefault();
        formError = 'Please use a stronger password';
        return;
      }
    }

    $effect(() => {
      if (password) {
        validatePassword(password);
      }
    });

    $effect(() => {
      if (form?.status === 'success' && form?.redirect) {
        goto(form.redirect);
      } else if (form?.message) {
        formError = form.message;
      }
    });
</script>

<svelte:head>
    <title>Sign up to BTOI</title>
</svelte:head>

<div class="flex min-h-screen">
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#64a6a0] via-[#5c9691] to-[#71b7b1] p-8 items-center justify-center">
        <div class="max-w-md text-white">
            <h1 class="text-3xl font-bold mb-6">Create your BTOI account</h1>
            <p class="mb-8 text-xl">Explore competitive programming, participate in contests, and solve challenging problems.</p>
            
            <div class="space-y-4">
                <div class="flex items-start">
                    <svg class="h-6 w-6 mr-3 text-teal-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Access to cutting-edge competitive programming problems</p>
                </div>
                <div class="flex items-start">
                    <svg class="h-6 w-6 mr-3 text-teal-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Join a community of passionate programmers</p>
                </div>
                <div class="flex items-start">
                    <svg class="h-6 w-6 mr-3 text-teal-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Participate in local and international competitions</p>
                </div>
            </div>
        </div>
    </div>
    
    <div class="w-full lg:w-1/2 p-4 sm:p-8 flex items-center justify-center">
        <div class="w-full max-w-md space-y-6">
            
            <!-- Header -->
            <div class="text-center">
                <Head2>Sign up to BTOI</Head2>
                <p class="mt-2 text-sm font-body text-gray-600">
                  Already have an account? 
                  <a href="/signin" class="font-medium text-blue-600 hover:text-blue-500">Sign in →</a>
                </p>
            </div>
            
            {#if formError}
            <div class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {formError}
            </div>
            {/if}
            
            <form method="POST" class="space-y-4" onsubmit={handleSubmit} use:enhance>
                <!-- Email -->
                <div class="space-y-1">
                    <label for="email" class="block text-sm font-medium text-gray-700">
                        Email<span class="text-red-600">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      bind:value={email}
                      placeholder="btoi.account@btoi.info.vn"
                    />
                </div>
                
                <!-- Password -->
                <div class="space-y-1">
                    <label for="password" class="block text-sm font-medium text-gray-700">
                        Password<span class="text-red-600">*</span>
                    </label>
                    <Input
                      name="password"
                      type="password"
                      bind:value={password}
                      placeholder="Create a strong password"
                    />
                    {#if password}
                        <div class="mt-2">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs text-gray-500">
                                    {passwordFeedback}
                                </span>
                            </div>
                            <div class="flex gap-1 h-1">
                                <div class={cn(
                                    "w-1/3 rounded-l-full transition-colors duration-300",
                                    passwordStrength >= 1 ? "bg-red-500" : "bg-gray-200"
                                )}></div>
                                <div class={cn(
                                    "w-1/3 transition-colors duration-300",
                                    passwordStrength >= 2 ? "bg-yellow-500" : "bg-gray-200"
                                )}></div>
                                <div class={cn(
                                    "w-1/3 rounded-r-full transition-colors duration-300",
                                    passwordStrength >= 3 ? "bg-green-500" : "bg-gray-200"
                                )}></div>
                            </div>
                            <p class="text-xs text-gray-500 mt-2">
                                Password should be at least 8 characters including a number and a lowercase letter
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- Confirm Password -->
                <div class="space-y-1">
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                        Confirm Password<span class="text-red-600">*</span>
                    </label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      bind:value={confirmPassword}
                      placeholder="Re-enter your password"
                    />
                    {#if confirmPassword !== password}
                        <p class="mt-1 text-xs text-red-500">
                            Passwords do not match
                        </p>
                    {/if}
                </div>
                
                <!-- Username -->
                <div class="space-y-1">
                    <label for="username" class="block text-sm font-medium text-gray-700">
                        Username<span class="text-red-600">*</span>
                    </label>
                    <Input
                      name="username"
                      type="text"
                      bind:value={username}
                      placeholder="Enter your username"
                    />
                    <p class="font-body text-xs text-gray-500">
                        Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
                    </p>
                </div>
                
                <!-- Submit button -->
                <div class="pt-2">
                    <Button 
                        class="w-full" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {#if isLoading}
                            Creating account...
                        {:else}
                            Continue
                        {/if}
                    </Button>
                </div>
                
                <div class="font-body text-xs text-gray-500 mt-4 space-y-4">
                    <p>
                        By creating an account, you agree to the 
                        <a href="/terms" class="text-blue-600 hover:underline">Terms of Service</a>. 
                        For more information about our privacy practices, see the 
                        <a href="/privacy" class="text-blue-600 hover:underline">BTOI Privacy Statement</a>.
                        We'll occasionally send you account-related emails.
                    </p>
                </div>
            </form>
            
            <!-- <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </div> -->
            
            <!-- <div class="grid grid-cols-2 gap-4">
                <Button variant="outline" class="w-full" onclick={signInWithGitHub}>
                    <svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                    </svg>
                    GitHub
                </Button>
                <Button variant="outline" class="w-full" onclick={signInWithGoogle}>
                    <svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path>
                    </svg>
                    Google
                </Button>
            </div> -->
        </div>
    </div>
</div>