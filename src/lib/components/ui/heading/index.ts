import { tv, type VariantProps } from 'tailwind-variants';
import h1 from './h1.svelte';
import h2 from './h2.svelte';
import h3 from './h3.svelte';
import h4 from './h4.svelte';
import h5 from './h5.svelte';
import h6 from './h6.svelte';

export const headingVariants = tv({
	base: 'text-text font-heading font-semibold',
	variants: {
		variant: {
			h1: 'text-h1 tracking-tighter font-bold',
			h2: 'text-h2 tracking-tight font-bold',
			h3: 'text-h3 tracking-tight',
			h4: 'text-h4 tracking-tight',
			h5: 'text-h5',
			h6: 'text-h6'
		}
	}
});

export type HeadingProps = VariantProps<typeof headingVariants>;

export {
	h1 as Head1,
	h2 as Head2,
	h3 as Head3,
	h4 as Head4,
	h5 as Head5,
	h6 as Head6,
};
