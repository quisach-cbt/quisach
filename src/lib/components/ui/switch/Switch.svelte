<script lang='ts'>
  import { cn } from '$lib/utils';
  import { switchVariants, thumbVariants, type SwitchVariants } from '.';

  type Props =  {
    value?: boolean,
    label?: string,
  } & SwitchVariants;

  let { value = $bindable(false), label = '', variant = 'default', size = 'md', disabled = false, }: Props = $props();

  let switchClasses = $derived(cn(
    'sr-only peer',
    switchVariants({ variant, size, disabled })
  ));
  let thumbContainerClasses = $derived(cn(
    'relative inline-flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    'peer-checked:bg-primary',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
    'data-[state=unchecked]:bg-input'
  ));
  let thumbClasses = $derived(cn(
    thumbVariants({ size }),
    'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
    'data-[state=unchecked]:translate-x-0',
    'data-[state=checked]:translate-x-5'
  ));
</script>

<label
  class={cn(
    'inline-flex items-center gap-2',
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
  )}
>
	<input
		type="checkbox"
		role="switch"
		aria-label="Switch"
		class={cn(switchClasses, 'hidden')}
		bind:checked={value}
		{disabled}
	/>
	<span
		class={thumbContainerClasses}
		aria-hidden="true"
		data-state={value ? 'checked' : 'unchecked'}
	>
		<span
		class={thumbClasses}
		data-state={value ? 'checked' : 'unchecked'}
		></span>
	</span>
	{#if label}
		<span class="text-sm font-medium">{label}</span>
	{/if}
</label>
