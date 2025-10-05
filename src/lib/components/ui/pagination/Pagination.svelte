<script lang="ts">
  import { cn } from "$lib/utils";
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";
  
  const props = $props<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }>();
  
  const pages = $derived(getPageNumbers(props.currentPage, props.totalPages));
  
  function getPageNumbers(current: number, total: number) {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    if (current <= 3) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    
    if (current >= total - 2) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    
    return [1, '...', current - 1, current, current + 1, '...', total];
  }
  
  function handlePageClick(page: number | string) {
    if (typeof page === 'number' && page !== props.currentPage) {
      props.onPageChange(page);
    }
  }
</script>

<div class="flex justify-center mt-6 mb-8">
  <nav aria-label="Pagination" class="inline-flex items-center gap-1.5 bg-transparent">    
    <div class="flex items-center gap-1 px-1 py-1 rounded-full bg-white/70 backdrop-blur-sm shadow-sm">
      {#each pages as page}
        {#if page === '...'}
          <span class="flex items-center justify-center h-8 w-8 text-gray-400">
            {page}
          </span>
        {:else}
          <button
            onclick={() => handlePageClick(page)}
            class={cn(
              "flex items-center justify-center h-8 w-8 text-sm rounded-full transition-all duration-200",
              page === props.currentPage 
                ? "bg-primary text-white font-medium shadow-sm" 
                : "text-gray-700 hover:bg-gray-100"
            )}
            aria-current={page === props.currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        {/if}
      {/each}
    </div>
  </nav>
</div>