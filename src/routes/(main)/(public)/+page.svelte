<script lang="ts">
	import SEO from '$lib/components/common/seo';
	import { Button } from '$lib/components/ui/button';
	import { Head1, Head2 } from '$lib/components/ui/heading';
	import { Input } from '$lib/components/ui/input';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const bookCategories = [
		'Văn học',
		'Kinh tế',
		'Tâm lý - Kỹ năng sống',
		'Giáo trình - Tham khảo',
		'Tin học - Công nghệ',
		'Truyện tranh',
		'Sách thiếu nhi',
		'Sách ngoại văn',
		'Sách nói - Audio book'
	];
</script>

<SEO
	title="Quí Sách: Chia sẻ và khám phá sách miễn phí"
	description="Nền tảng chia sẻ và khám phá sách"
	noSuffix
/>

<section class="py-8 text-center">
	<div class="h-64 w-full rounded-2xl bg-gray-200"></div>
</section>

<section class="py-8">
	<div class="flex items-center justify-center gap-4">
		{#each bookCategories as item}
			<div class="py-2">
				<Button variant="outline">{item}</Button>
			</div>
		{/each}
	</div>
</section>

<section class="py-8">
	<Head2 class="mb-4">Sách gần đây</Head2>

	<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
		{#each data.results as { id, coverUrl, title, author, owner }}
			<li
				class="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
			>
				<!-- Cover -->
				<div class="relative">
					{#if coverUrl}
						<img src={coverUrl} alt={title} class="h-52 w-full object-cover" />
					{:else}
						<div
							class="flex h-48 w-full items-center justify-center bg-gray-200 text-sm text-gray-500 italic dark:bg-gray-700"
						>
							No Cover
						</div>
					{/if}
					<!-- Status Badge -->
					<!-- {#if status}
					<span
						class="absolute top-2 right-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold
							{status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : ''}
							{status === 'INACTIVE' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : ''}
							{status === 'TRADED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' : ''}"
					>
						{#if status === 'ACTIVE'} <CheckCircle size={14} /> {/if}
						{#if status === 'INACTIVE'} <XCircle size={14} /> {/if}
						{#if status === 'TRADED'} <Repeat2 size={14} /> {/if}
						{status}
					</span>
				{/if} -->
				</div>

				<!-- Info -->
				<div class="flex flex-1 flex-col p-4">
					<h3
						class="line-clamp-1 text-base font-semibold text-gray-900 transition group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400"
					>
						{title}
					</h3>
					<p class="line-clamp-1 text-sm text-gray-600 dark:text-gray-400">{author}</p>
					{#if owner}
						<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">👤 {owner.username}</p>
					{/if}
					<div class="mt-3 flex gap-2">
						<Button class="grow">
							Mượn
						</Button>
						<Button variant="outline" href={`/books/${id}`}>
							Chi tiết
						</Button>
					</div>

					<!-- Actions -->
					<!-- {#if status === 'ACTIVE'}
				{:else}
					<div class="mt-3">
						<button
							class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed"
							disabled
						>
							Không khả dụng
						</button>
					</div>
				{/if} -->
				</div>
			</li>
		{/each}
	</ul>
</section>
<!-- 
<section>
	<Head2 class="mb-4">Sách nổi bật</Head2>
</section>

<section>
	<Head2 class="mb-4">Dành cho bạn</Head2>
</section> -->
