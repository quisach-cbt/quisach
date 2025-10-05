<script lang="ts">
	import { LeftNavigation } from "$lib/components/layout/navigations";

	let { children } = $props();
</script>

<div class="flex">
	<LeftNavigation />
	{@render children()}
</div>