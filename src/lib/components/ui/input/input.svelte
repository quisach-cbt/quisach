<script lang="ts">
	import { cn } from '$lib/utils';
	import { inputVariants, type InputProps } from '.';

    interface Props extends InputProps {
        class?: string;
        value?: string;
        [prop: string]: unknown;
    }

	let {
		class: className,
		value = $bindable(''),
		size = 'md',
		disabled = false,
		...rest
	}: Props = $props();
</script>

<div class="flex flex-col gap-2">
	<input
        class={cn(inputVariants({ size, disabled, className }))}
		bind:value
		{disabled}
		{...rest}
	/>
</div>
