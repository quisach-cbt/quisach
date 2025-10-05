<script lang="ts">
	import { Head2, Head4 } from '$lib/components/ui/heading';
	import { Button } from '$lib/components/ui/button';
	import { FileQuestion, Home, Search } from '@lucide/svelte';
	import { page } from '$app/state';

	const errorMessages: Record<number, string> = {
		404: 'The page you are looking for was not found.',
		403: 'You do not have permission to access this page.'
	};
</script>

<div class="flex grow items-center justify-center p-6 text-center">
	<div class="">
		<div class="mb-6">
			<FileQuestion size={80} class="text-primary mx-auto mb-4" />
			<Head2>{page.status} - {page.error?.message}</Head2>
			<div class="mt-2 text-gray-500">
				{errorMessages[page.status] ?? 'An unexpected error occurred.'}
			</div>
		</div>
		<div class="flex flex-col justify-center gap-3 sm:flex-row">
			<Button href="/problems">
				<Search size={18} />
				Browse All Problems
			</Button>

			<Button variant="outline" href="/home">
				<Home size={18} />
				Return to Homepage
			</Button>
		</div>
	</div>
</div>
