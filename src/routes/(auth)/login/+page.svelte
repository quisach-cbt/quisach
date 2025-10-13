<script lang="ts">
	import LoginForm from './login.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<LoginForm {form} />
