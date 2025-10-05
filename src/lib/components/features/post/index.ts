import Post from './post.svelte';
import PostDialog from './postdialog.svelte';
import { tv } from 'tailwind-variants';

const postVariants = tv({
	base: 'flex flex-col gap-4',
	variants: {
		variant: {
			pinned: 'bg-background text-foreground',
			normal: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border'
		},
		size: {
			sm: 'h-9 rounded-md px-3',
			md: 'h-10 px-4 py-2',
			lg: 'h-11 rounded-md px-8'
		}
	}
});

export { Post, PostDialog, postVariants };
