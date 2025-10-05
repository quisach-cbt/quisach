<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';
    import ContestNavigationBar from '$lib/components/features/contest/ContestNavigationBar.svelte';

    let { data, children }: { data: LayoutData, children: Snippet } = $props();
</script>

<div class="grid grid-rows-[3rem_1fr] grid-cols-1 h-full w-full">
    <ContestNavigationBar />
    {@render children()}
</div>