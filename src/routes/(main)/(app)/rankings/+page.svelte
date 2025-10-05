<script lang="ts">
  import { Head2 } from '$lib/components/ui/heading';
  import { Medal, ArrowUp, Clock, FileSpreadsheet, Wrench, TrendingUp, BarChart } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';

  let progress = $state(0);
  let activeTab = $state(0);
  
  onMount(() => {
    const interval = setInterval(() => {
      progress = Math.min(progress + 1, 75);
      if (progress === 75) clearInterval(interval);
    }, 50);
    
    return () => clearInterval(interval);
  });

  const tabContent = [
    {
      title: "Global Rankings",
      description: "Compete with users from around the world on the BTOI global leaderboard based on your performance in contests and problem-solving.",
      icon: BarChart
    },
    {
      title: "Rating System",
      description: "Our Elo-based rating system tracks your performance over time, with ratings updated after each contest participation.",
      icon: TrendingUp
    },
    {
      title: "Categories",
      description: "Specialized leaderboards for different problem categories like algorithms, data structures, dynamic programming, and more.",
      icon: FileSpreadsheet
    }
  ];
</script>

<div class="container mx-auto px-6 py-12">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-12">
      <div class="inline-flex p-3 mb-6 bg-primary/10 rounded-full text-primary">
        <Medal size={32} />
      </div>
      <Head2 class="mb-4">Rankings</Head2>
      <p class="text-gray-600 text-lg">Global leaderboards and competitive rankings are coming soon</p>
    </div>
    
    <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <div class="flex flex-col md:flex-row">
        <!-- Left section - preview image/animation -->
        <div class="md:w-2/5 bg-gradient-to-br from-primary/90 to-blue-700 text-white p-8 flex flex-col">
          <h3 class="text-2xl font-bold mb-4">Rankings Feature</h3>
          <p class="mb-6 text-white/80">Track your progress and compete with other competitive programmers on the global leaderboard.</p>
          
          <div class="mt-auto">
            <div class="mb-3">
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-white/80">Development Progress</span>
                <span class="text-sm font-medium text-white">{progress}%</span>
              </div>
              <div class="w-full bg-white/20 rounded-full h-2">
                <div class="bg-white h-2 rounded-full transition-all duration-500" style="width: {progress}%"></div>
              </div>
            </div>
            <div class="text-sm text-white/70">
              Expected release: Q2 2025
            </div>
          </div>
        </div>
        
        <!-- Right section - feature details -->
        <div class="md:w-3/5 p-8">
          <div class="flex border-b border-gray-200 mb-6">
            {#each tabContent as tab, i}
              <button 
                class="px-4 py-2 font-medium text-sm transition-colors relative {activeTab === i ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}"
                onclick={() => activeTab = i}
              >
                {tab.title}
                {#if activeTab === i}
                  <div class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
                {/if}
              </button>
            {/each}
          </div>
          
          <div class="mb-8">
            <div class="flex items-center mb-4">
              <div class="p-2 rounded-lg bg-primary/10 mr-3">
                <svelte:component this={tabContent[activeTab].icon} class="text-primary" size={24} />
              </div>
              <h3 class="text-xl font-semibold">{tabContent[activeTab].title}</h3>
            </div>
            <p class="text-gray-600">{tabContent[activeTab].description}</p>
          </div>
          
          <div class="space-y-4">
            <div class="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div class="flex">
                <Wrench class="flex-shrink-0 mt-1 mr-3 text-primary" size={20} />
                <div>
                  <h4 class="font-medium text-gray-900">Modified Elo Rating</h4>
                  <p class="text-sm text-gray-600 mt-1">
                    The BTOI ranking system uses a modified Elo rating algorithm that takes into account problem difficulty, contest performance, and consistency.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div class="flex">
                <Clock class="flex-shrink-0 mt-1 mr-3 text-primary" size={20} />
                <div>
                  <h4 class="font-medium text-gray-900">Real-Time Updates</h4>
                  <p class="text-sm text-gray-600 mt-1">
                    Your ranking will update in real-time after contest participation and problem submissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end">
            <Button variant="default">
              Join the Waitlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>