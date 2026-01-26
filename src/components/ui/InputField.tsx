import { Field, Input, Label } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { twMerge } from "tailwind-merge";

import { Chip } from "@/components/ui/Chip";

type InputFieldProps = {
  label: string;
  errorMessage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputField = ({
  id,
  label,
  errorMessage,
  autoComplete,
  className,
  ...inputProps
}: InputFieldProps) => (
  <Field className={twMerge("flex flex-col gap-0.5", className)}>
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
    <Input
      id={id}
      {...inputProps}
      autoComplete={autoComplete ?? "off"}
      className="block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-gray-800/70 dark:text-white dark:ring-gray-700/70 dark:focus:ring-blue-500"
    />
  </Field>
);
