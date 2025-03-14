import { Field, Checkbox as HeadlessCheckbox, Label } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { type ClassNameValue, twMerge } from "tailwind-merge";

import { Typography } from "@/components/ui/Typography";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: ClassNameValue;
};

export const Checkbox = ({
  checked,
  onChange,
  label,
  description,
  className,
}: CheckboxProps) => (
  <Field className={twMerge("flex flex-col", className)}>
    <div className="flex items-center gap-2">
      <HeadlessCheckbox
        checked={checked}
        onChange={onChange}
        className="flex size-5 items-center justify-center rounded-sm border border-gray-300 bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden data-checked:bg-blue-600 dark:border-gray-600 dark:bg-gray-800"
      >
        {checked && <CheckIcon className="size-4 fill-white" />}
      </HeadlessCheckbox>
      <Label className="font-medium">{label}</Label>
    </div>
    {description && (
      <Typography.Small className="ml-7" muted>
        {description}
      </Typography.Small>
    )}
  </Field>
);
