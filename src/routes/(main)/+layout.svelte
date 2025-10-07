<script lang="ts">
	import { TopNavigation } from '$lib/components/layout/navigations';
	import { Landing as FooterLanding } from '$lib/components/layout/footer';

	let { children } = $props();
</script>

<TopNavigation />

<main class="px-4 lg:px-32 xl:px-64">{@render children()}</main>

<FooterLanding />
