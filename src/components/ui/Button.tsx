import { Button as HeadlessButton } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const buttonVariants = tv({
  base: "shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 flex items-center justify-center w-fit h-fit",
  variants: {
    variant: {
      primary:
        "bg-linear-to-br from-blue-500 to-blue-700 text-white hover:brightness-125",
      secondary:
        "bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-inset ring-gray-200 dark:text-white dark:bg-white/10 dark:hover:bg-white/15 dark:ring-transparent",
      destructive: "bg-red-600 text-white hover:bg-red-500",
    },
    size: {
      xs: "text-xs font-medium rounded-md px-[7px] py-0.5 gap-0.5",
      sm: "text-xs font-medium rounded-md px-2 py-1 gap-1",
      md: "text-sm font-semibold rounded-md px-3 py-2 gap-1.5",
      lg: "text-base font-semibold rounded-md px-4 py-3 gap-1.5",
    },
    disabled: {
      true: "opacity-60 hover:bg-unset dark:hover:bg-unset",
      false: "cursor-pointer",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

const iconVariants = tv({
  variants: {
    size: {
      xs: "size-3",
      sm: "size-3.5",
      md: "size-4",
      lg: "size-5",
    },
  },
});

type ButtonProps = VariantProps<typeof buttonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    busy?: boolean;
    icon?: React.ElementType;
  };

export const Button = ({
  variant,
  size = "md",
  icon: Icon,
  busy = false,
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) => (
  <HeadlessButton
    {...props}
    aria-busy={busy}
    disabled={disabled}
    className={twMerge(buttonVariants({ variant, size, disabled, className }))}
  >
    {busy ? (
      <LoadingSpinner className={iconVariants({ size })} aria-hidden="true" />
    ) : (
      Icon && <Icon className={iconVariants({ size })} aria-hidden="true" />
    )}
    {children}
  </HeadlessButton>
);
