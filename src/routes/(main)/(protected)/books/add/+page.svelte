<script lang="ts">
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription,
		FieldSeparator
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { enhance } from '$app/forms';

	let { form } = $props();
	let imagePreview: string | null = null;

	function handleImageUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => (imagePreview = reader.result as string);
			reader.readAsDataURL(file);
		}
	}
</script>

<form class="flex flex-col gap-6 px-64" method="POST" enctype="multipart/form-data" use:enhance>
	<FieldGroup>
		<div class="flex flex-col items-center gap-1 text-center">
			<h1 class="text-2xl font-bold">Đăng sách cho mượn</h1>
			<p class="text-muted-foreground text-sm text-balance">
				Điền thông tin sách bạn muốn chia sẻ
			</p>
		</div>

		<Field>
			<FieldLabel for="title">Tên sách</FieldLabel>
			<Input id="title" name="title" type="text" placeholder="Ví dụ: Thuật toán và Lập trình" required />
		</Field>

		<Field>
			<FieldLabel for="author">Tác giả</FieldLabel>
			<Input id="author" name="author" type="text" placeholder="Ví dụ: Nguyễn Văn A" required />
		</Field>

		<Field>
			<FieldLabel for="description">Mô tả</FieldLabel>
			<textarea
				id="description"
				name="description"
				rows="3"
				class="w-full border rounded p-2"
				placeholder="Tình trạng sách, ghi chú..."
			></textarea>
		</Field>

		<Field>
			<FieldLabel for="image">Ảnh bìa</FieldLabel>
			<Input id="image" name="image" type="file" accept="image/*" on:change={handleImageUpload} />
			{#if imagePreview}
				<img src={imagePreview} alt="Preview" class="mt-2 w-32 h-40 object-cover rounded" />
			{/if}
		</Field>

		<Field>
			<div class="flex items-center gap-2">
				<input id="available" type="checkbox" name="available" checked />
				<label for="available">Còn sẵn sàng cho mượn</label>
			</div>
		</Field>

		<Field>
			{#if form?.message}
				<div class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
					{form.message}
				</div>
			{/if}
			<Button type="submit">Đăng sách</Button>
		</Field>

		<FieldSeparator>Hoặc</FieldSeparator>
		<FieldDescription class="text-center">
			<a href="/books" class="underline underline-offset-2">Xem danh sách sách đã đăng</a>
		</FieldDescription>
	</FieldGroup>
</form>
