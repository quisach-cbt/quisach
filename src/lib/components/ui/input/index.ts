import Input from './input.svelte';

import { tv, type VariantProps } from 'tailwind-variants';

export const inputVariants = tv({
    base: 'font-body block w-full rounded-md border transition focus:outline-none focus:ring-2 focus:ring-primary',
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

export type InputProps = VariantProps<typeof inputVariants>;

export { Input };
