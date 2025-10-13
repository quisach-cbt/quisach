<script lang="ts">
	import { Logo } from '$lib/components/common/logo';
	import { Button } from '$lib/components/ui/button';
	import { Dropdown } from '$lib/components/ui/dropdown';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ChevronDown, Coins, Search, BookPlus } from '@lucide/svelte';
	import { Avatar } from '$lib/components/ui/avatar';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	type NavItem = {
		name: string;
		href: string;
		dropdownContent?: Array<{ name: string; href: string }>;
	};

	const navItems: Array<NavItem> = [
		// {
		// 	name: 'Resources',
		// 	href: '/resources',
		// 	dropdownContent: []
		// }
	];
</script>

<header
	class={cn(
		'bg-background/50 relative z-50 flex items-center justify-between border-b-2 px-4 py-2 backdrop-blur-xl transition-colors duration-300 xl:px-16 dark:border-slate-700 dark:bg-slate-900/80',
		!page.data.currentUser && ''
	)}
>
	<a href="/" aria-label="Home page"><Logo /></a>
	<div class="flex items-center gap-4">
		<nav class="hidden md:flex md:items-center md:gap-4">
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
			<form action="/search" method="GET" class="flex items-center rounded-md border">
				<label for="nav-search" class="sr-only">Tìm kiếm</label>
				<input
					id="nav-search"
					name="q"
					type="text"
					placeholder="Tìm kiếm sách..."
					class="h-8 rounded-md border-gray-300 px-3 py-1 text-sm placeholder-gray-400 focus:outline-none"
					required
				/>
				<Button class="h-8" variant="link" size="sm" type="submit">
					<span class="sr-only">Tìm kiếm</span>
					<Search size={16} />
				</Button>
			</form>
		</nav>

		{#if page.data.currentUser}
			{@const user = page.data.currentUser}
			<Button
				variant="ghost"
				href="/points"
				class="hidden items-center gap-1 rounded-md px-2 py-1 md:flex"
			>
				<Coins size={16} />
				<span class="font-medium">{user.points}</span>
			</Button>
			
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<div
						class="flex items-center gap-2 rounded-sm px-2 py-1 transition-colors hover:bg-gray-200"
					>
						<Avatar size="sm" src={user.avatarUrl} alt={user.displayName} />
						<div class="-space-y-1 text-start">
							<p class="max-w-44 overflow-hidden font-bold text-nowrap text-ellipsis">
								{user.displayName}
							</p>
							<p class="font-body max-w-40 text-xs text-gray-500">@{user.username}</p>
						</div>
					</div>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<h2 class="sr-only">User menu</h2>
					<DropdownMenu.Label>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.displayName}</span>
							<span class="text-muted-foreground truncate text-xs">
								{user.email}
							</span>
						</div>
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					{#each [{ label: 'Hồ sơ', href: `/@${user.username}` }, { label: 'Cài đặt', href: '/settings' }, { label: 'Hỗ trợ', href: '/settings' }] as { href, label }}
						<DropdownMenu.Item>
							<a {href}>{label}</a>
						</DropdownMenu.Item>
					{/each}
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<form action="/api/auth/logout" method="POST">
							<button type="submit" class="text-red-500"> Đăng xuất </button>
						</form>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<Button
				href="/books/add"
				class="hidden items-center md:flex"
			>
				<BookPlus size={16} />
				<span class="font-medium">Thêm sách</span>
			</Button>
		{:else}
			<div class="hidden items-center gap-4 md:flex">
				<Button variant="outline" href="/login">Đăng nhập</Button>
				<Button href="/signup">Đăng ký</Button>
			</div>
		{/if}
	</div>
</header>
