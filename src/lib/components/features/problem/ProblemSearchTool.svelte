<script lang="ts">
    import { Search, SlidersHorizontal, FunnelX } from '@lucide/svelte';
    import { cn } from '$lib/utils';
    import { Select } from '$lib/components/ui/select';
    import { Button } from '$lib/components/ui/button';
    import { Head5 } from '$lib/components/ui/heading';
    
    type SelectOption = {
        value: string;
        label: string;
    };
    
    let { onSearch } = $props();
    
    let searchQuery = $state('');
    let category = $state('all');
    let hideSolved = $state(false);
    let minPoints = $state<number | ''>('');
    let maxPoints = $state<number | ''>('');
    
    const categoryOptions: SelectOption[] = [
        { value: 'all', label: 'All Categories' },
        { value: 'algorithm', label: 'Algorithms' },
        { value: 'data-structures', label: 'Data Structures' },
        { value: 'math', label: 'Mathematics' },
        { value: 'string', label: 'String Problems' },
        { value: 'graph', label: 'Graph Theory' }
    ];
    
    type SearchFilters = {
        category: string;
        hideSolved: boolean;
        minPoints: number | null;
        maxPoints: number | null;
    };
    
    function handleCategoryChange(event: any) {
        category = event.detail;
    }
    
    function handleApplyFilters() {
        const filters: SearchFilters = {
            category,
            hideSolved,
            minPoints: minPoints === '' ? null : Number(minPoints),
            maxPoints: maxPoints === '' ? null : Number(maxPoints)
        };
        
        onSearch(searchQuery, filters);
    }
    
    function handleClearFilters() {
        searchQuery = '';
        category = 'all';
        hideSolved = false;
        minPoints = '';
        maxPoints = '';
        
        handleApplyFilters();
    }
</script>

<aside class="border-l">
    <div class="sticky top-0 space-y-6 z-0 p-4">
        <Head5>Search Problems</Head5>
        
        <div class="relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} class="text-gray-400" />
            </div>
            <input 
                type="text" 
                bind:value={searchQuery}
                placeholder="Search by keywords..." 
                class="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
        </div>
        
        <div class="space-y-5">
            <div class="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                <SlidersHorizontal size={16} />
                <span>Filters</span>
            </div>
            
            <div class="space-y-1.5">
                <label for="category" class="text-sm font-medium text-gray-700">Category</label>
                <Select
                    options={categoryOptions}
                    value={category}
                    onChange={handleCategoryChange}
                    class="mt-1"
                />
            </div>
            
            <div class="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="hideSolved" 
                    bind:checked={hideSolved}
                    class="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <label for="hideSolved" class="text-sm text-gray-600 cursor-pointer select-none">
                    Hide solved problems
                </label>
            </div>
            
            <!-- Points Range -->
            <div class="space-y-1.5">
                <label class="text-sm font-medium text-gray-700" for="">Points Range</label>
                <div class="flex items-center gap-2 mt-1">
                    <input 
                        type="number" 
                        bind:value={minPoints}
                        placeholder="Min" 
                        min="0"
                        class="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span class="text-gray-500">-</span>
                    <input 
                        type="number" 
                        bind:value={maxPoints}
                        placeholder="Max" 
                        min="0"
                        class="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center gap-2 pt-2">
                <Button variant="default" class="w-full" onclick={handleApplyFilters}>
                    Apply
                </Button>
                <Button variant="outline" size="icon" onclick={handleClearFilters} title="Clear filters">
                    <FunnelX size={18} />
                </Button>
            </div>
        </div>
        
        <div>
            <Head5 class="text-lg font-medium">Quick Stats</Head5>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-gray-600">Total Problems:</span>
                    <span class="font-medium">247</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Problems Solved:</span>
                    <span class="font-medium">42</span>
                </div>
            </div>
        </div>
    </div>
</aside>