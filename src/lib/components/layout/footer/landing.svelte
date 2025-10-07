<script lang="ts">
	import { Logo } from '$lib/components/common/logo';
	import { Head6 } from '$lib/components/ui/heading';
	import { Facebook, GitHub, Discord } from '$lib/components/icons';
	import type { Component } from 'svelte';

	const footerSections: Array<{
		label: string;
		links: Array<{
			label: string;
			icon?: Component;
			href: string;
		}>;
	}> = [
		{
			label: 'Quí Sách',
			links: [
				{
					label: 'Về Quí Sách',
					href: '/'
				},
				{
					label: 'Điều khoản',
					href: '/wiki'
				},
				{
					label: 'Chính sách bảo mật',
					href: '/btoai'
				},
				{
					label: 'Quy chế hoạt động',
					href: '/btoai'
				},
				{
					label: 'Liên hệ truyền thông',
					href: '/'
				},
				{
					label: 'Blog',
					href: ''
				}
			]
		},
		{
			label: 'Dịch vụ',
			links: [
				{
					label: 'Trung Tâm Trợ Giúp',
					href: '/problems'
				},
				{
					label: 'Hướng dẫn mượn/trả sách',
					href: '/contests'
				},
				{
					label: 'Cho/Mượn sách',
					href: '/'
				},
				{
					label: 'Liên hệ',
					href: '/organizations'
				},
				// {
				// 	label: 'Groups',
				// 	href: '/groups'
				// }
			]
		},
		// {
		// 	label: 'Tài nguyên',
		// 	links: [
		// 		{
		// 			label: 'Docs',
		// 			href: '/docs'
		// 		},
		// 		{
		// 			label: 'Guides',
		// 			href: '/guides'
		// 		},
		// 		{
		// 			label: 'Help',
		// 			href: '/help'
		// 		},
		// 		{
		// 			label: 'Pricing',
		// 			href: '/pricing'
		// 		},
		// 		{
		// 			label: 'Solutions',
		// 			href: '/solution'
		// 		},
		// 		{
		// 			label: 'About',
		// 			href: '/about'
		// 		}
		// 	]
		// },
		{
			label: 'Theo dõi chúng tôi',
			links: [
				{
					label: 'Facebook',
					icon: Facebook,
					href: 'https://facebook.com/btoi.info'
				},
				{
					label: 'Discord',
					icon: Discord,
					href: 'https://discord.com'
				}
			]
		}
	];
</script>

<footer class="px-6 sm:px-8 md:px-12 lg:px-16 py-8 space-y-8 bg-white border-t">
	<h2 class="sr-only">Site-wide Links</h2>

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex gap-8">
		<section class="grow lg:flex-1">
			<Logo />
		</section>

		{#each footerSections as { label: sectionLabel, links }}
			{@const ariaLabelledBy = `footer-section-${sectionLabel.toLowerCase().replace(/\\s+/g, '-')}`}
			<nav class="space-y-4 min-w-[160px]" aria-labelledby={ariaLabelledBy}>
				<Head6 id={ariaLabelledBy} class="text-sm font-semibold uppercase tracking-wide text-slate-700">
					{sectionLabel}
				</Head6>
				<ul class="space-y-2 text-sm text-slate-600">
					{#each links as { icon: Icon, label, href }}
						<li class="group transition-colors hover:text-black fill-muted">
							<a
								{href}
								target={href.startsWith('http') ? '_blank' : '_self'}
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 hover:text-sky-700"
							>
								{#if Icon}
									<Icon class="inline-block align-middle w-4 h-4" />
								{/if}
								<span>{label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/each}
	</div>

	<div class="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 border-t border-slate-200 pt-4 gap-2">
		<span class="text-center sm:text-left">
			&copy; <time datetime="2025">2025</time> Quí Sách. Tất cả quyền được bảo lưu.
		</span>
		<span class="text-center sm:text-right">by <a href="https://github.com/onlyin32bit" class="hover:underline">@onlyin32bit↗</a></span>
	</div>
</footer>

