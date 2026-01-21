import { Field, Checkbox as HeadlessCheckbox, Label } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { type ClassNameValue, twMerge } from "tailwind-merge";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: ClassNameValue;
};

export const Checkbox = ({
  checked,
  onChange,
  label,
  className,
}: CheckboxProps) => (
  <Field className={twMerge("flex items-center gap-1.5", className)}>
    <HeadlessCheckbox
      checked={checked}
      onChange={onChange}
      className="flex size-5 items-center justify-center rounded-sm border border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden data-checked:bg-blue-600 dark:border-gray-700/70 dark:bg-gray-800"
    >
      {checked && <CheckIcon className="size-4 fill-white" />}
    </HeadlessCheckbox>
    <Label className="text-sm">{label}</Label>
  </Field>
);
