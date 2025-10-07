<script lang="ts">
	import SEO from '$lib/components/common/seo';
	import { Button } from '$lib/components/ui/button';
	import { Head1, Head2 } from '$lib/components/ui/heading';
	import { Input } from '$lib/components/ui/input';

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
	<div class="h-64 w-full bg-gray-200"></div>
</section>

<section class="py-8">
	<div class="flex justify-center items-center gap-4">
		{#each bookCategories as item}
			<div class="py-2">
				<Button variant="outline">{item}</Button>
			</div>
		{/each}
	</div>
</section>

<section>
	<Head2 class="mb-4">Sách gần bạn</Head2>
</section>

<section>
	<Head2 class="mb-4">Sách nổi bật</Head2>
</section>

<section>
	<Head2 class="mb-4">Dành cho bạn</Head2>
</section>