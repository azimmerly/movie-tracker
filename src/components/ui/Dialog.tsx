import {
  CloseButton,
  DialogBackdrop,
  DialogPanel,
  Dialog as HeadlessDialog,
  type DialogProps as HeadlessDialogProps,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { twMerge, type ClassNameValue } from "tailwind-merge";

type DialogProps = HeadlessDialogProps & {
  className?: ClassNameValue;
  children: React.ReactNode;
};

export const Dialog = ({ className, children, ...props }: DialogProps) => (
  <HeadlessDialog {...props} className="relative z-10">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-gray-900/70 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
    />
    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
        <DialogPanel
          transition
          className={twMerge(
            "bg-offwhite relative w-full transform overflow-hidden rounded-lg p-3 pt-5 text-left shadow-xl ring-1 ring-transparent transition-all ring-inset data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:max-w-lg sm:p-6 sm:data-closed:translate-y-0 sm:data-closed:scale-95 dark:bg-gray-800 dark:ring-gray-700/70",
            className,
          )}
        >
          <>
            <CloseButton className="absolute top-4 right-4 hidden cursor-pointer rounded-sm text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden sm:block">
              <span className="sr-only">Close</span>
              <XMarkIcon aria-hidden="true" className="size-5.5" />
            </CloseButton>
            {children}
          </>
        </DialogPanel>
      </div>
    </div>
  </HeadlessDialog>
);
