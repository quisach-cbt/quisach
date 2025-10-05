<script lang="ts">
    import type { PageProps } from './$types';
    import { PaneGroup, Pane, PaneResizer } from 'paneforge';

    const { data }: PageProps = $props();
    const { problem } = data;
    
    $effect(() => {
        console.log('Problem data loaded:', data.problem);
    });
</script>

<div class="flex flex-col h-screen">
    <PaneGroup direction="horizontal">
        <Pane defaultsize={50}>
            <div class="p-4">
                <h1 class="text-2xl font-bold mb-4">{data.problem.name}</h1>
                <div class="mb-4">
                    <span class="font-semibold">Points:</span> {data.problem.point}
                </div>
                <div class="mb-4">
                    <span class="font-semibold">Category:</span> {data.problem.category?.name || 'Uncategorized'}
                </div>
                {#if data.problem.authors?.length > 0}
                    <div class="mb-4">
                        <span class="font-semibold">Authors:</span>
                        {#each data.problem.authors as author}
                            <span class="ml-1">{author.user?.displayName || author.user?.username || 'Unknown'}</span>
                            {#if author !== data.problem.authors[data.problem.authors.length - 1]}, {/if}
                        {/each}
                    </div>
                {/if}
            </div>
        </Pane>
        <PaneResizer />
        <Pane defaultsize={50}>
            <PaneGroup direction="vertical">
                <Pane defaultsize={50}>
                    Gay
                </Pane>
                <PaneResizer />
                <Pane defaultsize={50}>
                    Gay
                </Pane>
            </PaneGroup>
        </Pane>
    </PaneGroup>
</div>
