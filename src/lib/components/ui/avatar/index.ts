import { tv, type VariantProps } from 'tailwind-variants';
import Avatar from './avatar.svelte';

const avatarVariants = tv({
    base: 'size-10 overflow-hidden bg-gray-200 rounded-full object-cover',
    variants: {
        size: {
            default: 'size-10',
            sm: 'size-8',
            lg: 'size-12',
            xl: 'size-14',
            xxl: 'size-20',
            huge: 'size-32',
            giant: 'size-48'
        }
    },
    defaultVariants: {
        size: 'default'
    }
});

export type AvatarVariants = VariantProps<typeof avatarVariants>;

export { Avatar, avatarVariants };