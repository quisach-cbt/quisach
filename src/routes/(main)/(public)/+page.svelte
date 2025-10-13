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
	<div class="h-64 w-full bg-gray-200 rounded-2xl"></div>
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

<section>
	<Head2 class="mb-4">Sách gần đây</Head2>
	<ul class="flex">
		{#each data.results as { coverUrl, title, author, owner }}
			<li
				class="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md dark:bg-gray-800"
			>
				<!-- Cover -->
				{#if coverUrl}
					<img src={coverUrl} alt={title} class="h-16 w-12 rounded-md object-cover" />
				{:else}
					<div
						class="flex h-16 w-12 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500 italic"
					>
						No Cover
					</div>
				{/if}
				<!-- Info -->
				<div class="flex-1">
					<h3 class="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
						{title}
					</h3>
					<p class="text-xs text-gray-600 dark:text-gray-400">by {author}</p>
					{#if owner}
						<p class="text-xs text-gray-500">Owner: {owner.username}</p>
					{/if}
				</div>
				<!-- Status + action -->
				<!-- <div class="flex items-center gap-2">
					<span
						class="rounded-full px-2 py-1 text-[10px] font-semibold
			  {status === 'ACTIVE' ? 'bg-green-100 text-green-700' : ''}
			  {status === 'INACTIVE' ? 'bg-gray-100 text-gray-600' : ''}
			  {status === 'TRADED' ? 'bg-blue-100 text-blue-700' : ''}"
					>
						{status}
					</span>
					{#if status === 'ACTIVE'}
						<button
							class="rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700"
						>
							Trade
						</button>
					{/if}
				</div> -->
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
