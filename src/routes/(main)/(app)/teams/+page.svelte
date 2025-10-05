<script lang="ts">
	import { Head2 } from '$lib/components/ui/heading';
	import { Users2, Target, Trophy, Shield, Code, MessageSquare, Star } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	let progress = $state(0);
	let activeTab = $state(0);
	
	onMount(() => {
		const interval = setInterval(() => {
			progress = Math.min(progress + 1, 45);
			if (progress === 45) clearInterval(interval);
		}, 50);
		
		return () => clearInterval(interval);
	});

	const tabContent = [
		{
			title: "Team Formation",
			description: "Form teams of 2-5 members to participate in team-based competitions and collaborative problem solving sessions.",
			icon: Users2
		},
		{
			title: "Team Competitions",
			description: "Participate in ICPC-style team contests with real-time collaboration and shared submissions.",
			icon: Trophy
		},
		{
			title: "Team Practice",
			description: "Access specialized team training problems and exercises designed to improve collaborative problem-solving skills.",
			icon: Target
		}
	];

	const earlyAccessFeatures = [
		"Priority access to all team features",
		"Unlimited team creation",
		"Exclusive practice problems",
		"Advanced analytics dashboard",
		"Direct feedback channel to developers"
	];
</script>

<div class="container mx-auto px-6 py-12">
	<div class="max-w-5xl mx-auto">
		<div class="text-center mb-12">
			<div class="inline-flex p-3 mb-6 bg-primary/10 rounded-full text-primary">
				<Shield size={32} />
			</div>
			<Head2 class="mb-4">Competitive Teams</Head2>
			<p class="text-gray-600 text-lg">Form teams and compete together in ICPC-style programming contests</p>
		</div>
		
		<div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 mb-12">
			<div class="flex flex-col md:flex-row">
				<!-- Left section - preview image/animation and early access -->
				<div class="md:w-2/5 bg-gradient-to-br from-primary/90 to-indigo-700 text-white p-8 flex flex-col">
					<h3 class="text-2xl font-bold mb-4">Teams Feature</h3>
					<p class="mb-6 text-white/80">Train and compete together with your teammates in a collaborative environment.</p>
					
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
								<Code class="flex-shrink-0 mt-1 mr-3 text-primary" size={20} />
								<div>
									<h4 class="font-medium text-gray-900">Shared Code Editor</h4>
									<p class="text-sm text-gray-600 mt-1">
										Real-time collaborative code editor allows multiple team members to work on the same solution simultaneously.
									</p>
								</div>
							</div>
						</div>
						
						<div class="p-4 rounded-lg bg-gray-50 border border-gray-100">
							<div class="flex">
								<MessageSquare class="flex-shrink-0 mt-1 mr-3 text-primary" size={20} />
								<div>
									<h4 class="font-medium text-gray-900">Team Chat</h4>
									<p class="text-sm text-gray-600 mt-1">
										Integrated chat system for seamless communication during practice sessions and competitions.
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
