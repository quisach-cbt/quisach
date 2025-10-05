<script lang="ts">
	import { Logo } from '$lib/components/ui/logo';
	import { Head6 } from '$lib/components/ui/heading';
	import { FacebookLogo, GitHubLogo, DiscordLogo } from '$lib/components/icons';

	const footerSections: Array<{
		label: string;
		links: Array<{
			label: string;
			icon?: typeof GitHubLogo;
			href: string;
		}>;
	}> = [
		{
			label: 'Products',
			links: [
				{
					label: 'BTOI Platform',
					href: '/'
				},
				{
					label: 'BTOI Wiki',
					href: '/wiki'
				},
				{
					label: 'BTOAI',
					href: '/btoai'
				},
				{
					label: 'JudgeNow',
					href: '/'
				},
				{
					label: 'JudgeNowAI',
					href: '/'
				}
			]
		},
		{
			label: 'Platform',
			links: [
				{
					label: 'Problems',
					href: '/problems'
				},
				{
					label: 'Contests',
					href: '/contests'
				},
				{
					label: 'Blogs',
					href: '/'
				},
				{
					label: 'Organizations',
					href: '/organizations'
				},
				{
					label: 'Groups',
					href: '/groups'
				}
			]
		},
		{
			label: 'Resources',
			links: [
				{
					label: 'Docs',
					href: '/docs'
				},
				{
					label: 'Guides',
					href: '/guides'
				},
				{
					label: 'Help',
					href: '/help'
				},
				{
					label: 'Pricing',
					href: '/pricing'
				},
				{
					label: 'Solutions',
					href: '/solution'
				},
				{
					label: 'About',
					href: '/about'
				}
			]
		},
		{
			label: 'Social',
			links: [
				{
					label: 'GitHub',
					icon: GitHubLogo,
					href: 'https://github.com/Ben-Tre-Olympiad-in-Informatics'
				},
				{
					label: 'Facebook',
					icon: FacebookLogo,
					href: 'https://facebook.com/btoi.info'
				},
				{
					label: 'Discord',
					icon: DiscordLogo,
					href: 'https://discord.com'
				}
			]
		}
	];
</script>

<footer class="px-16 py-8 space-y-8">
	<h2 class="sr-only">Site-wide Links</h2>
	<div class="flex gap-2">
		<section class="grow">
			<Logo />
		</section>
		{#each footerSections as { label: sectionLabel, links }}
			{@const ariaLabelledBy = `footer-section-${sectionLabel.toLowerCase().replace(/\s+/g, '-')}`}
			<nav class="flex-1 space-y-4" aria-labelledby={ariaLabelledBy}>
				<Head6 id={ariaLabelledBy}>{sectionLabel}</Head6>
				<ul class="space-y-4 text-muted">
					{#each links as { icon: Icon, label, href }}
						<li class="group transition-colors hover:text-black fill-muted">
							<a {href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
								{#if Icon}
									<Icon class="inline-block align-middle mr-1" />
								{/if}
								<span>{label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/each}
	</div>
	<div class="flex justify-between">
		<span>&copy; <time datetime="2025">2025</time> Ben Tre Olympiad in Informatics, Community.</span>
        <span class="px-4 py-1 font-semibold text-gray-600 bg-green-300 rounded-full">All system online</span>
	</div>
</footer>
