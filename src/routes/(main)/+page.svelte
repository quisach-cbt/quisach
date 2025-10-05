<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Head1 } from '$lib/components/ui/heading';
	import { Landing } from '$lib/components/layout/footer';
	import { Input } from '$lib/components/ui/input';
</script>

<svelte:head>
	<title>BTOI Platform: Brand new competitive programming experience</title>
	<meta
		name="description"
		content="BTOI Plaform by Ben Tre Olympiad in Informatics Community provide you with the most up to date tools and infrastructure to experience a new online platform - Built by CP-ers - For CP-ers"
	/>
</svelte:head>

<section class="py-32 text-center">
	<div class="container flex flex-col items-center justify-center px-6 mx-auto">
		<Head1 class="max-w-4xl">Your platform for learning competitive programming</Head1>
		<p class="mb-8 text-lg text-gray-600">
			Our platform is designed to help you learn, practice, and excel in coding challenges.
		</p>
		<div class="space-x-4">
			<Button size="lg">Sign Up</Button>
			<Button size="lg" variant="outline">For enterprise</Button>
		</div>
	</div>
</section>

<Landing />
