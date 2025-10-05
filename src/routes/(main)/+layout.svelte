<script lang="ts">
	import { TopNavigation } from "$lib/components/layout/navigations";

	let { children } = $props();
</script>

<TopNavigation />

{@render children()}
