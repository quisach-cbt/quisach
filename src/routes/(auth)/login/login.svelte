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

</script>

<form class="flex flex-col gap-6" method="POST" use:enhance>
	<FieldGroup>
		<div class="flex flex-col items-center gap-1 text-center">
			<h1 class="text-2xl font-bold">Đăng nhập</h1>
			<p class="text-muted-foreground text-sm text-balance">Nhập email và mật khẩu để đăng nhập</p>
		</div>
		<Field>
			<FieldLabel for="email">Email</FieldLabel>
			<Input id="email" type="email" name="email" placeholder="m@example.com" required />
		</Field>
		<Field>
			<div class="flex items-center">
				<FieldLabel for="password">Mật khẩu</FieldLabel>
				<a href="/forgot" class="ml-auto text-sm underline-offset-4 hover:underline">
					Quên mật khẩu?
				</a>
			</div>
			<Input id="password" type="password" name="password" placeholder="••••••••••" required />
		</Field>
		<Field>
			{#if form?.message}
				<div class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
					{form.message}
				</div>
			{/if}
			<Button type="submit">Đăng nhập</Button>
		</Field>
		<FieldSeparator>Hoặc tiếp tục với</FieldSeparator>
		<Field>
			<Button variant="outline" type="button">
				<svg xmlns="http://www.w3.org/2000/svg" aria-label="Google" role="img" viewBox="0 0 512 512"
					><path d="m0 0H512V512H0" fill="#fff" /><path
						fill="#34a853"
						d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
					/><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" /><path
						fill="#fbbc02"
						d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
					/><path
						fill="#ea4335"
						d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
					/></svg
				>
				Google
			</Button>
			<FieldDescription class="text-center">
				Chưa có tài khoản?
				<a href="/signup" class="underline underline-offset-2">Đăng kí</a>
			</FieldDescription>
		</Field>
	</FieldGroup>
</form>
