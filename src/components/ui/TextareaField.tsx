import { Field, Label, Textarea } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { twMerge } from "tailwind-merge";

import { Chip } from "@/components/ui/Chip";

type TextareaFieldProps = {
  label: string;
  errorMessage?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaField = ({
  id,
  label,
  errorMessage,
  className,
  ...textareaProps
}: TextareaFieldProps) => (
  <Field className={twMerge("flex flex-col gap-1", className)}>
    <div className="flex items-center gap-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {errorMessage && (
        <Chip
          icon={ExclamationTriangleIcon}
          text={errorMessage}
          variant="warning"
          className="px-1.5 py-px font-normal"
        />
      )}
    </div>
    <Textarea
      id={id}
      rows={3}
      {...textareaProps}
      className="block w-full resize-none rounded-md border-0 bg-white py-2 text-sm text-mist-900 shadow-xs ring-1 ring-mist-300 ring-inset placeholder:text-mist-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset dark:bg-mist-800/50 dark:text-white dark:ring-mist-700/50 dark:placeholder:text-mist-500"
    />
  </Field>
);
