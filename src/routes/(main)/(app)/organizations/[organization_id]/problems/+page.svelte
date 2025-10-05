<script lang='ts'>
	import { CheckCircle } from '@lucide/svelte';
</script>

<div class="flex flex-col items-center justify-center w-full py-16 px-4">
	<div class="text-center max-w-2xl">
		<h1 class="text-3xl font-bold text-gray-800 mb-4">Coming Soon</h1>
		<div class="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
		
		<p class="text-gray-600 mb-8">We're working hard to bring you this feature. It will be available in the near future.</p>
		
		<div class="bg-gray-100 p-6 rounded-lg shadow-sm mb-8">
			<h2 class="text-xl font-semibold text-gray-700 mb-4">What to expect</h2>
			<ul class="text-left space-y-3">
				<li class="flex items-start">
					<CheckCircle class="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
					<span class="text-gray-600">Enhanced problem management tools</span>
				</li>
				<li class="flex items-start">
					<CheckCircle class="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
					<span class="text-gray-600">Custom categorization options</span>
				</li>
				<li class="flex items-start">
					<CheckCircle class="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
					<span class="text-gray-600">Improved analytics and reporting</span>
				</li>
			</ul>
		</div>
		
		<p class="text-sm text-gray-500">Thank you for your patience!</p>
	</div>
</div>