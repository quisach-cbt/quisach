import dropdown from './dropdown.svelte';
import { tv, type VariantProps } from 'tailwind-variants';

export const dropdownVariants = tv({
    base: 'absolute z-10',
    variants: {
        position: {
            top: 'left-1/2 bottom-full -translate-1/2',
            bottom: 'left-1/2 -translate-x-1/2',
            left: 'right-full top-0',
            right: 'left-full top-0',
        }
    },
    defaultVariants: {
        position: 'bottom' 
    }
});

export type DropdownProps = VariantProps<typeof dropdownVariants>;


export { dropdown as Dropdown };