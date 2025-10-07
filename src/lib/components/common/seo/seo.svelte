<script lang="ts">
	import { getTitleSuffix } from '$lib/utils/seo';

	type Props = {
		title: string;
		noSuffix?: boolean;
		description?: string;
	};

	let { title, noSuffix = false, description }: Props = $props();

	const SEPARATOR = '|'
	const DEFAULT_SUFFIX = 'Quí Sách';

	if (!noSuffix) title += ` ${SEPARATOR} ${getTitleSuffix() ?? DEFAULT_SUFFIX}`;
</script>

<svelte:head>
	<title>{title}</title>
	
	<meta name="description" content={description ?? 'Quí Sách - Nền tảng chia sẻ và trao đổi sách miễn phí cho cộng đồng.'} />
	<meta name="keywords" content="Quí Sách, Quí Sách App, Quí Sách Platform">

	<meta property="og:type" content="website" />

	<!-- <link rel="icon" href="/favicon.ico" sizes="any" /> -->
	<!-- <link rel="icon" href="/favicon.svg" type="image/svg+xml" /> -->
	<link rel="icon" href="/favicon.png" />
	<link rel="apple-touch-icon" href="/favicon.png">
</svelte:head>
