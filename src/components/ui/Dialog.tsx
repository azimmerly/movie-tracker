import {
  CloseButton,
  DialogBackdrop,
  DialogPanel,
  Dialog as HeadlessDialog,
  type DialogProps as HeadlessDialogProps,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
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

type DialogProps = {
  className?: string;
  children: React.ReactNode;
  header: VariantProps<typeof iconContainerVariants> & {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
  };
} & HeadlessDialogProps;

export const Dialog = ({
  className,
  header,
  children,
  ...props
}: DialogProps) => (
  <HeadlessDialog {...props} className="relative z-50">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-mist-900/60 backdrop-blur-xs transition data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
    />
    <div className="fixed inset-0 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
        <DialogPanel
          transition
          className={twMerge(
            "relative w-full transform overflow-hidden rounded-xl bg-mist-50 p-3 pt-5 text-left shadow-xl ring-1 ring-transparent transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:max-w-lg sm:p-6 sm:data-closed:translate-y-0 sm:data-closed:scale-95 dark:bg-mist-900 dark:ring-mist-800",
            className,
          )}
        >
          <CloseButton className="absolute top-4 right-4 hidden cursor-pointer rounded-sm text-mist-400 hover:text-mist-500 focus:ring-2 focus:ring-blue-600 focus:outline-hidden sm:block dark:text-mist-500 dark:hover:text-mist-400">
            <span className="sr-only">Close</span>
            <XMarkIcon aria-hidden="true" className="size-5.5" />
          </CloseButton>
          <div
            className={twMerge(
              "mb-6 flex flex-col items-center gap-3 sm:flex-row",
              header.subtitle ? "sm:items-start" : "sm:items-center",
            )}
          >
            <div className={iconContainerVariants({ variant: header.variant })}>
              <header.icon
                aria-hidden="true"
                className={iconVariants({ variant: header.variant })}
              />
            </div>
            <div className="text-center sm:text-left">
              <Typography.H3>{header.title}</Typography.H3>
              {header.subtitle && (
                <Typography.Small className="mt-2" muted>
                  {header.subtitle}
                </Typography.Small>
              )}
            </div>
          </div>
          {children}
        </DialogPanel>
      </div>
    </div>
  </HeadlessDialog>
);
