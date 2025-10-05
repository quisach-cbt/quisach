<script lang="ts">
	import { Logo } from '$lib/components/ui/logo';
	import { Button } from '$lib/components/ui/button';
	import { Dropdown } from '$lib/components/ui/dropdown';
	import { ChevronDown, Home } from '@lucide/svelte';
	import { Avatar } from '$lib/components/ui/avatar';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	type NavItem = {
		name: string;
		href: string;
		dropdownContent?: Array<{ name: string; href: string }>;
	};
	const navItems: Array<NavItem> = [
		{ name: 'BTOAI (Coming soon)', href: '/btoai' },
		{ name: 'About', href: '/about' },
		{ name: 'Academy', href: '/academy' },
		{
			name: 'Resources',
			href: '/resources',
			dropdownContent: [
				{ name: 'Docs', href: '/docs' },
				{ name: 'Dev logs', href: '/devlogs' },
				{ name: 'GitHub', href: 'https://github.com' },
				{ name: 'Server health', href: '/stats' }
			]
		}
	];
</script>

<header
	class={cn(
		'bg-background/50 relative z-50 flex h-16 items-center justify-between border-b-2 px-4 xl:px-16 backdrop-blur-xl transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/80',
		!page.data.currentUser && ''
	)}
>
	<a href="/" aria-label="Home page"><Logo /></a>
	<div class="flex items-center gap-4">
		<nav>
			<h2 class="sr-only">Side-bar links</h2>
			<ul class="text-muted flex items-center gap-2">
				{#each navItems as { name, href, dropdownContent }}
					<li class="group">
						{#snippet navItem()}
							<a
								{href}
								class="hover:text-text rounded-md px-3 py-2 text-sm font-medium transition-colors group-hover:bg-gray-200"
							>
								{name}
								{#if dropdownContent}
									<ChevronDown
										class="ml-1 inline-block transition-transform group-hover:translate-y-[3px]"
										size={16}
									/>
								{/if}
							</a>
						{/snippet}

						{#if dropdownContent}
							<Dropdown trigger={navItem}>
								{#snippet content()}
									<div
										class="animate-in slide-in-from-top-1 flex w-44 flex-col gap-2 rounded-md bg-white p-2 shadow-xs ring-1 ring-gray-300"
									>
										{#each dropdownContent as { name, href }}
											<a
												{href}
												class="hover:text-text rounded-sm p-2 text-sm font-medium transition-colors hover:bg-gray-200"
											>
												{name}
											</a>
										{/each}
									</div>
								{/snippet}
							</Dropdown>
						{:else}
							{@render navItem()}
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
		{#if page.data.currentUser}
			{@const user = page.data.currentUser}
			<Dropdown>
				{#snippet trigger()}
					<div
						class="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-gray-200"
					>
						<Avatar size="sm" src={user.avatarUrl} alt={user.displayName} />
						<div class="-space-y-1">
							<p class="max-w-44 overflow-hidden font-bold text-nowrap text-ellipsis">
								{user.displayName}
							</p>
							<p class="max-w-40 font-body text-xs text-gray-500">@{user.username}</p>
						</div>
					</div>
				{/snippet}
				{#snippet content()}
					<div
						class="ring-opacity-5 animate-in slide-in-from-top-1 flex w-44 flex-col gap-1 rounded-md bg-white p-2 shadow-xs ring-1 ring-gray-300"
					>
						<a
							href="/profile/{user.username}"
							class="text-muted hover:text-text rounded-sm p-2 text-sm font-medium transition-colors hover:bg-gray-200"
						>
							Profile
						</a>
						<form action="/signout" method="POST">
							<button
								type="submit"
								class="w-full rounded-sm p-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
							>
								Sign Out
							</button>
						</form>
					</div>
				{/snippet}
			</Dropdown>
			{#if page.url.pathname === '/'}
				<Button size="sm" href="/home">
					<Home size={16} /> Go to Home
				</Button>
			{/if}
		{:else}
			<div class="hidden items-center gap-4 md:flex">
				<Button variant="outline" href="/signin">Sign In</Button>
				<Button href="/signup">Sign Up</Button>
			</div>
		{/if}
	</div>
</header>
