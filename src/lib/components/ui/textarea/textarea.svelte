<script lang="ts">
	import { tv } from 'tailwind-variants';

    let {
        name = undefined,
        id = undefined,
        value = $bindable(""),
        placeholder = "Enter text here",
        disabled = false,
        size = "md",
        rows = 3,
        ...rest
    }: {
        name?: string;
        id?: string;
        value?: any;
        placeholder?: string;
        disabled?: boolean;
        size?: "sm" | "md" | "lg";
        rows?: number;
        [prop: string]: unknown;
    } = $props();

	const textareaVariants = tv({
		base: 'font-body block w-full rounded-md border transition focus:outline-none focus:ring-2 focus:ring-primary resize-y',
		variants: {
			size: {
				sm: 'text-sm py-1 px-2',
				md: 'text-base py-2 px-3',
				lg: 'text-lg py-3 px-4'
			},
			disabled: {
				true: 'bg-gray-100 cursor-not-allowed',
				false: 'bg-white'
			}
		},
		defaultVariants: {
			size: 'md',
			disabled: false
		}
	});

	const textareaClasses = $derived(textareaVariants({ size, disabled }));
</script>

<div class="flex flex-col gap-2">
    <textarea
        {name}
        {id}
        bind:value
        {placeholder}
        class={textareaClasses}
        {disabled}
        {rows}
        {...rest}
    ></textarea>
</div>