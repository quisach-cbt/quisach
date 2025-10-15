<script lang="ts">
	import type { PageProps } from "./$types";

	let {data}: PageProps = $props()
</script>

<div class="mx-auto max-w-5xl p-6">
	<div class="flex flex-col md:flex-row gap-8">
		<!-- Cover -->
		<div class="flex-shrink-0 w-full md:w-1/3">
			{#if data.book.coverUrl}
				<img
					src={data.book.coverUrl}
					alt={data.book.title}
					class="w-full h-auto rounded-lg shadow-md object-cover"
				/>
			{:else}
				<div
					class="flex h-80 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-500 italic"
				>
					No Cover
				</div>
			{/if}
		</div>

		<!-- Book Info -->
		<div class="flex-1 flex flex-col gap-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{data.book.title}</h1>
				<p class="text-lg text-gray-600 dark:text-gray-400">by {data.book.author}</p>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
				{#if data.book.isbn}
					<div>
						<span class="font-semibold">ISBN:</span> {data.book.isbn}
					</div>
				{/if}
				{#if data.book.publishedAt}
					<div>
						<span class="font-semibold">Published:</span>
						{new Date(data.book.publishedAt).toLocaleDateString()}
					</div>
				{/if}
				<div>
					<span class="font-semibold">Owner:</span>
					{data.book.owner.displayName} (@{data.book.owner.username})
				</div>
			</div>

			{#if data.book.description}
				<div>
					<h2 class="text-lg font-semibold mb-2">📖 Description</h2>
					<p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
						{data.book.description}
					</p>
				</div>
			{/if}

			<!-- Actions -->
			<div class="flex gap-3 mt-auto">
				<button
					class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition"
				>
					Mượn sách
				</button>
				<button
					class="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
				>
					Quay lại danh sách
				</button>
			</div>
		</div>
	</div>
</div>
