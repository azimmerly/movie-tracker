import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

import { Typography } from "@/components/ui/Typography";

const iconContainerVariants = tv({
  base: "mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 dark:bg-mist-800",
  variants: {
    variant: {
      default: "bg-blue-100",
      destructive: "bg-red-100",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariants = tv({
  base: "size-6",
  variants: {
    variant: {
      default: "text-blue-600 dark:text-blue-500",
      destructive: "text-red-600 dark:text-red-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type DialogHeaderProps = VariantProps<typeof iconContainerVariants> & {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
};

export const DialogHeader = ({
  icon: Icon,
  title,
  subtitle,
  variant = "default",
}: DialogHeaderProps) => (
  <div
    className={twMerge(
      "mb-6 flex flex-col items-center gap-3 sm:flex-row",
      subtitle ? "sm:items-start" : "sm:items-center",
    )}
  >
    <div className={iconContainerVariants({ variant })}>
      <Icon aria-hidden="true" className={iconVariants({ variant })} />
    </div>
    <div className="text-center sm:text-left">
      <Typography.H3>{title}</Typography.H3>
      {subtitle && (
        <Typography.Small className="mt-2" muted>
          {subtitle}
        </Typography.Small>
      )}
    </div>
  </div>
);
