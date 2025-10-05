<script lang="ts">
  import { Head2 } from '$lib/components/ui/heading';
  import { UsersRound, Stars, MessageSquare, Info, Calendar, Users, BookOpen } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';

  let progress = $state(0);
  let activeTab = $state(0);
  
  onMount(() => {
    const interval = setInterval(() => {
      progress = Math.min(progress + 1, 60);
      if (progress === 60) clearInterval(interval);
    }, 50);
    
    return () => clearInterval(interval);
  });

  const tabContent = [
    {
      title: "Study Groups",
      description: "Form peer learning communities around specific topics and subject areas. Collaborate with like-minded programmers.",
      icon: UsersRound
    },
    {
      title: "Group Challenges",
      description: "Complete collaborative coding challenges and competitions designed specifically for group participation.",
      icon: Stars
    },
    {
      title: "Discussions",
      description: "Participate in dedicated forums for questions and knowledge sharing within your groups.",
      icon: MessageSquare
    }
  ];
</script>

<div class="container mx-auto px-6 py-12">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-12">
      <div class="inline-flex p-3 mb-6 bg-primary/10 rounded-full text-primary">
        <Users size={32} />
      </div>
      <Head2 class="mb-4">Study Groups</Head2>
      <p class="text-gray-600 text-lg">Collaborative learning spaces for competitive programming are launching soon</p>
    </div>
    
    <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <div class="flex flex-col md:flex-row">
        <!-- Left section - preview image/animation -->
        <div class="md:w-2/5 bg-gradient-to-br from-primary/90 to-green-700 text-white p-8 flex flex-col">
          <h3 class="text-2xl font-bold mb-4">Groups Feature</h3>
          <p class="mb-6 text-white/80">Learn and grow together with study groups focused on competitive programming topics.</p>
          
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
                <Calendar class="flex-shrink-0 mt-1 mr-3 text-primary" size={20} />
                <div>
                  <h4 class="font-medium text-gray-900">Group Events</h4>
                  <p class="text-sm text-gray-600 mt-1">
                    Schedule meetings, live coding sessions, and workshops with your study group members.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div class="flex">
                <BookOpen class="flex-shrink-0 mt-1 mr-3 text-primary" size={20} />
                <div>
                  <h4 class="font-medium text-gray-900">Shared Resources</h4>
                  <p class="text-sm text-gray-600 mt-1">
                    Create and share study materials, code solutions, and resources within your group.
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