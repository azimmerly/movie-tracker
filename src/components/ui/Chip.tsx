import { twMerge } from "tailwind-merge";

import { Typography } from "@/components/ui/Typography";
import { tv, type VariantProps } from "tailwind-variants";

const chipVariants = tv({
  base: "inline-flex w-fit items-center rounded px-1.75 py-0.75 font-medium",
  variants: {
    variant: {
      primary: "bg-blue-400/15 text-blue-600 dark:text-blue-400",
      secondary: "bg-mist-400/15 text-mist-600 dark:text-mist-400",
      success: "bg-green-400/15 text-green-600 dark:text-green-400",
      warning: "bg-red-400/15 text-red-700 dark:text-red-300",
    },
  },
  defaultVariants: {
    variant: "secondary",
  },
});

type ChipProps = VariantProps<typeof chipVariants> & {
  text: string;
  icon?: React.ElementType;
  className?: string;
};

export const Chip = ({ text, icon: Icon, variant, className }: ChipProps) => {
  return (
    <Typography.Tiny className={twMerge(chipVariants({ variant }), className)}>
      {Icon && <Icon className="mr-1 size-3.25" />}
      {text}
    </Typography.Tiny>
  );
};
