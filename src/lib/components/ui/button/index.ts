import Root, { type Props } from './button.svelte';
import { tv, type VariantProps } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	variants: {
		variant: {
			default: 'bg-primary text-background hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline'
		},
		size: {
			sm: 'h-9 px-3 gap-1',
			default: 'h-10 px-4 py-2 gap-2',
			lg: 'h-11 px-8 gap-3 text-lg',
			icon: 'size-9'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>;

export { Root as Button };
export type { Props as ButtonProps };
