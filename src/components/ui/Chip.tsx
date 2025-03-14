import { type ClassNameValue, twMerge } from "tailwind-merge";

import { Typography } from "@/components/ui/Typography";
import { tv, type VariantProps } from "tailwind-variants";

const chipVariants = tv({
  base: "inline-flex w-fit items-center rounded-md px-2 py-1 font-medium",
  variants: {
    variant: {
      primary: "bg-blue-400/15 text-blue-600 dark:text-blue-400",
      secondary: "bg-gray-400/15 text-gray-600 dark:text-gray-400",
      success: "bg-green-400/15 text-green-600 dark:text-green-400",
      warning: "bg-red-400/15 text-red-600 dark:text-red-400",
    },
  },
  defaultVariants: {
    variant: "secondary",
  },
});

type ChipProps = VariantProps<typeof chipVariants> & {
  text: React.ReactNode;
  icon?: React.ElementType;
  className?: ClassNameValue;
};

export const Chip = ({ text, icon: Icon, variant, className }: ChipProps) => {
  return (
    <Typography.Tiny className={twMerge(chipVariants({ variant }), className)}>
      {Icon && <Icon className="mr-1 size-3" />}
      {text}
    </Typography.Tiny>
  );
};
