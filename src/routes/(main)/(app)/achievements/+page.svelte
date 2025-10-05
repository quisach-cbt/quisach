<script lang="ts">
  import { Head2 } from '$lib/components/ui/heading';
  import { Award, Star, TrendingUp, BookOpen, Code2, Zap, Trophy, Flag } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';

  let progress = $state(0);
  let activeTab = $state(0);
  
  onMount(() => {
    const interval = setInterval(() => {
      progress = Math.min(progress + 1, 85);
      if (progress === 85) clearInterval(interval);
    }, 50);
    
    return () => clearInterval(interval);
  });

  const tabContent = [
    {
      title: "Badges",
      description: "Earn badges for completing specific challenges, solving difficult problems, and participating in contests.",
      icon: Award
    },
    {
      title: "Achievement Tiers",
      description: "Progress through different tiers for each achievement category. Bronze, Silver, Gold, and Diamond tiers reflect your mastery.",
      icon: Star
    },
    {
      title: "Showcase",
      description: "Display your earned achievements on your profile to showcase your programming accomplishments.",
      icon: Trophy
    }
  ];
</script>

<div class="container mx-auto px-6 py-12">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-12">
      <div class="inline-flex p-3 mb-6 bg-primary/10 rounded-full text-primary">
        <Award size={32} />
      </div>
      <Head2 class="mb-4">Badges & Achievements</Head2>
      <p class="text-gray-600 text-lg">Showcase your programming accomplishments and track your progress</p>
    </div>
    
    <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <div class="flex flex-col md:flex-row">
        <!-- Left section - preview image/animation -->
        <div class="md:w-2/5 bg-gradient-to-br from-primary/90 to-purple-700 text-white p-8 flex flex-col">
          <h3 class="text-2xl font-bold mb-4">Achievements System</h3>
          <p class="mb-6 text-white/80">Earn badges and achievements for your competitive programming accomplishments. Showcase your progress and climb the ranks!</p>
          
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
                <Code2 class="flex-shrink-0 mt-1 mr-3 text-primary" size={20} />
                <div>
                  <h4 class="font-medium text-gray-900">Achievement Categories</h4>
                  <p class="text-sm text-gray-600 mt-1">
                    Achievements are organized into categories: Contests, Problem Solving, Community Contributions, and Activity Streaks.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div class="flex">
                <Zap class="flex-shrink-0 mt-1 mr-3 text-primary" size={20} />
                <div>
                  <h4 class="font-medium text-gray-900">Progress Tracking</h4>
                  <p class="text-sm text-gray-600 mt-1">
                    Each achievement tracks your progress in real-time, showing you how close you are to earning the next level.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end">
            <Button class="flex items-center gap-2">
              <Flag size={16} />
              Get Notified When Achievements Launch
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>