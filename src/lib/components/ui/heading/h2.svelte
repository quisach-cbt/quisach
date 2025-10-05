<script lang="ts">
    import { cn } from "$lib/utils";
    import { headingVariants } from ".";
    import type { Snippet } from "svelte";

    let { children, class: className, ...rest }: { children: Snippet, class?: string, [prop: string]: unknown } = $props();
</script>

<h2 class={cn(headingVariants({variant: 'h2', className}))} {...rest}>{@render children()}</h2>