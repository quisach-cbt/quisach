<script lang="ts">
	import { Head2 } from '$lib/components/ui/heading';
  import { Pagination } from '$lib/components/ui/pagination';
  import ProblemSearchTool from '$lib/components/features/problem/ProblemSearchTool.svelte';
  import type { PageProps } from './$types';
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import { CheckCircle } from '@lucide/svelte';
  import { Avatar } from '$lib/components/ui/avatar';

  const { data }: PageProps = $props();
  
  let publishedProblems = $state(data.problems);
  
  const column = ['ID', 'Problem Name', 'Points', 'Category', 'Solved', 'Author'];
  
  $effect(() => {
    const updatedData = data;
    publishedProblems = updatedData.problems;
  });
  
  async function handlePageChange(page: number) {
    await goto(`?page=${page}`, { keepFocus: true, invalidateAll: true });
    await invalidateAll();
  }

  async function handleSearch(query: string, category: string, onlyUnsolved: boolean) {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'all') params.set('category', category);
    if (onlyUnsolved) params.set('unsolved', 'true');
    
    await goto(`?${params.toString()}`, { keepFocus: true, invalidateAll: true });
    await invalidateAll();
  }
</script>

<div class="w-full px-8 py-6">
  <section class="space-y-4 w-full">
    <Head2>Problems</Head2>
    <div class="border border-gray-200 rounded-md">
        <table class="min-w-full text-sm divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              {#each column as c}
                  <th class="px-4 py-2 font-bold text-left text-gray-900 font-body whitespace-nowrap">{c}</th>
              {/each}
            </tr>
          </thead>
          <tbody class="divide-y divide-white">
            {#each publishedProblems as problem (problem.id)}
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-2 font-medium text-gray-900 font-body whitespace-nowrap">{problem.id}</td>

                <td class="px-4 py-2 font-bold text-gray-700 transition-all duration-200 font-body whitespace-nowrap">
                  <a href="/problems/{problem.id}">{problem.name || 'Unnamed Problem'}</a>
                </td>

                <td class="px-4 py-2 text-gray-700 font-body whitespace-nowrap">{problem.point || 'N/A'}</td>

                <td class="px-4 py-2 font-medium text-gray-700 font-body whitespace-nowrap">
                  {#if problem.categoryId}
                    <span class="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-blue-700">
                      {problem.category?.name || 'Unknown'}
                    </span>
                  {:else}
                    <span class="inline-flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-700">
                      Uncategorized
                    </span>
                  {/if}
                </td>
                
                <td class="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                  {#if true}
                    <CheckCircle class="inline w-5 h-5 text-green-500" />
                  {:else}
                    <span class="text-gray-400">-</span>
                  {/if}
                </td>

                <td class="px-4 py-2 text-gray-700 whitespace-nowrap">
                  {#if problem.id}
                    {@const authorUser = problem.authors[0]?.user}
                    <div class="flex items-center gap-2">
                      <div class="flex overflow-hidden origin-left scale-75 rounded-full">
                      <Avatar 
                        src={authorUser?.avatarUrl || ''} 
                        alt={authorUser?.displayName || 'Unknown'}
                      />
                      </div>
                      <div class="flex flex-col font-body">
                      <span class="font-bold">{authorUser?.displayName || 'Unknown'}</span>
                      <span class="text-sm font-normal text-gray-500">@{authorUser?.username || 'unknown'}</span>
                      </div>
                    </div>
                  {:else}
                    <span class="text-gray-500">No author</span>
                  {/if}
                </td>
              </tr>
            {/each}
            
            {#if publishedProblems.length === 0}
              <tr>
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">No problems found</td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
  </section>
</div>
