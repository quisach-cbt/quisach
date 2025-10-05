<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Head2 } from '$lib/components/ui/heading';
	import { Input } from '$lib/components/ui/input';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Sign in - BTOI</title>
</svelte:head>

<div class="flex h-screen">
	<div
		class="hidden items-center justify-center bg-gradient-to-br from-[#64a6a0] via-[#5c9691] to-[#71b7b1] p-8 lg:flex lg:w-1/2"
	>
		<div class="max-w-md text-white">
			<h1 class="mb-6 text-3xl font-bold">Welcome back to BTOI</h1>
			<p class="mb-8 text-xl">
				Sign in to your account to continue your competitive programming journey.
			</p>

			<div class="space-y-4">
				<div class="flex items-start">
					<svg
						class="mr-3 h-6 w-6 text-teal-200"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p>Access your saved problems and solutions</p>
				</div>
				<div class="flex items-start">
					<svg
						class="mr-3 h-6 w-6 text-teal-200"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p>Track your progress and achievements</p>
				</div>
				<div class="flex items-start">
					<svg
						class="mr-3 h-6 w-6 text-teal-200"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p>Connect with the competitive programming community</p>
				</div>
			</div>
		</div>
	</div>

	<div class="flex w-full items-center justify-center p-4 sm:p-8 lg:w-1/2">
		<div class="w-full max-w-md space-y-6">
			<div class="text-center">
				<Head2>Sign in to BTOI</Head2>
				<p class="mt-2 text-gray-600">
					New to BTOI?
					<a href="/signup" class="text-blue-600 hover:text-blue-500"
						>Create an account →</a
					>
				</p>
			</div>

			{#if form?.message}
				<div class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
					{form.message}
				</div>
			{/if}

			<form class="space-y-4" method="POST">
				<div>
                    <label for="email_or_username" class="text-gray-700 mb-4">Username or Email</label>
                    <Input id="email_or_username" name="email_or_username" type="text" placeholder="Enter your username or email" />
                </div>

				<div class="relative">
					<label for="password">Password</label>
					<Input id="password" name="password" type="password" placeholder="Enter your password" />
					<a
						href="/password-reset"
						class="absolute top-0 right-0 text-sm text-blue-600 hover:text-blue-500"
					>
						Forgot password?
					</a>
				</div>

                <Button class="w-full" type="submit">Sign in</Button>
			</form>
		</div>
	</div>
</div>
