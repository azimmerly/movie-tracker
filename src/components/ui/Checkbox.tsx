import {
  Field,
  Checkbox as HeadlessCheckbox,
  type CheckboxProps as HeadlessCheckboxProps,
  Label,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { type ClassNameValue, twMerge } from "tailwind-merge";

type CheckboxProps = Omit<HeadlessCheckboxProps, "className" | "children"> & {
  label: string;
  className?: ClassNameValue;
};

export const Checkbox = ({
  checked,
  label,
  className,
  ...props
}: CheckboxProps) => (
  <Field className={twMerge("flex items-center gap-1.5", className)}>
    <HeadlessCheckbox
      {...props}
      checked={checked}
      className="flex size-5 items-center justify-center rounded-sm border border-mist-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden data-checked:bg-blue-600 dark:border-mist-700 dark:bg-mist-800/70"
    >
      {checked && <CheckIcon className="size-4 fill-white" />}
    </HeadlessCheckbox>
    <Label className="text-sm">{label}</Label>
  </Field>
);
