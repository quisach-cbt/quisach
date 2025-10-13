<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	let { form } = $props();
</script>

<form class="flex flex-col gap-6">
	<Field.Group>
		<div class="flex flex-col items-center gap-1 text-center">
			<h1 class="text-2xl font-bold">Create your account</h1>
			<p class="text-muted-foreground text-sm text-balance">
				Fill in the form below to create your account
			</p>
		</div>
		<Field.Field>
			<Field.Label for="name">Họ và Tên</Field.Label>
			<Input id="name" type="text" name="name" placeholder="Nguyen Van A" required />
		</Field.Field>
		<Field.Field>
			<Field.Label for="email">Email</Field.Label>
			<Input id="email" type="email" name="email" placeholder="m@example.com" required />
		</Field.Field>
		<Field.Field>
			<Field.Label for="password">Password</Field.Label>
			<Input id="password" type="password" name="password" required />
			<Field.Description></Field.Description>
		</Field.Field>
		<Field.Field>
			<Field.Label for="confirm-password">Confirm Password</Field.Label>
			<Input id="confirm-password" type="password" required />
			<Field.Description></Field.Description>
		</Field.Field>
		<Field.Field>
			<Button type="submit">Tạo tài khoản</Button>
		</Field.Field>
		<Field.Separator>Hoặc tiếp tục với</Field.Separator>
		<Field.Field>
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
			<Field.Description class="px-6 text-center">
				Đã có tài khoản? <a href="/login">Đăng nhập</a>
			</Field.Description>
		</Field.Field>
	</Field.Group>
</form>
