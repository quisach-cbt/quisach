<script lang="ts">
    import { cn } from "$lib/utils";
    import { headingVariants } from ".";
    import type { Snippet } from "svelte";

    let { children, class: className, ...rest }: { children: Snippet, class?: string, [prop: string]: unknown } = $props();
</script>

<h3 class={cn(headingVariants({variant: 'h3', className}))} {...rest}>{@render children()}</h3>