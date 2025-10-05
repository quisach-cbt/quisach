import Switch from "./Switch.svelte";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const switchVariants = tv({
  base: "relative inline-flex items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  variants: {
    variant: {
      default: "bg-gray-200 data-[state=checked]:bg-primary",
      primary: "bg-gray-200 data-[state=checked]:bg-blue-600",
      success: "bg-gray-200 data-[state=checked]:bg-green-500",
      danger: "bg-gray-200 data-[state=checked]:bg-red-500",
      warning: "bg-gray-200 data-[state=checked]:bg-yellow-500",
    },
    size: {
      sm: "h-5 w-9",
      md: "h-6 w-11",
      lg: "h-7 w-[52px]",
    },
    disabled: {
      true: "cursor-not-allowed opacity-50",
      false: "cursor-pointer",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    disabled: false,
  },
});

const thumbVariants = tv({
  base: "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform",
  variants: {
    size: {
      sm: "h-3.5 w-3.5 data-[state=checked]:translate-x-4",
      md: "h-5 w-5 data-[state=checked]:translate-x-5",
      lg: "h-6 w-6 data-[state=checked]:translate-x-6",
    }
  },
  defaultVariants: {
    size: "md",
  },
});

export type SwitchVariants = VariantProps<typeof switchVariants>;
export type SwitchOption = {
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    ariaLabel?: string;
};

export { Switch, switchVariants, thumbVariants };
