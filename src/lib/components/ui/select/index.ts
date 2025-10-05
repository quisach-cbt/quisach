import Select from './Select.svelte';
import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

const selectVariants = tv({
  base: "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    variant: {
      default: "border-input hover:bg-accent/10",
      error: "border-red-500 focus:ring-red-400",
      success: "border-green-500 focus:ring-green-400",
    },
    size: {
      default: "h-10",
      sm: "h-8 text-xs px-2.5",
      lg: "h-12 text-base px-4",
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

export type SelectVariants = VariantProps<typeof selectVariants>;
export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export { Select, selectVariants };

