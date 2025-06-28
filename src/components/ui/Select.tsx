import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { type ClassNameValue, twMerge } from "tailwind-merge";

import { Typography } from "@/components/ui/Typography";

export type SelectOption = { value: string; label: string };

type SelectProps = {
  label?: string;
  icon?: React.ElementType;
  options: SelectOption[];
  selected: SelectOption;
  setSelected: (selected: SelectOption) => void;
  className?: ClassNameValue;
};

export const Select = ({
  label,
  icon: Icon = ChevronUpDownIcon,
  options,
  selected,
  setSelected,
  className,
}: SelectProps) => (
  <Listbox
    as="div"
    value={selected}
    onChange={setSelected}
    className={twMerge("flex flex-col gap-0.5", className)}
  >
    {label && (
      <Label>
        <Typography.Tiny muted>{label}</Typography.Tiny>
      </Label>
    )}
    <div className="relative">
      <ListboxButton className="relative w-full rounded-md bg-white py-1.5 pr-10 pl-3 text-left shadow-xs ring-1 ring-gray-200 ring-inset focus:ring-2 focus:ring-blue-600 focus:outline-hidden sm:text-sm/6 dark:bg-gray-800 dark:ring-gray-700/70">
        <Typography.Small className="block truncate">
          {selected.label}
        </Typography.Small>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <Icon
            aria-hidden="true"
            className="size-4 text-gray-400 dark:text-gray-500"
          />
        </span>
      </ListboxButton>
      <ListboxOptions
        transition
        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 shadow-lg ring-1 ring-gray-200/70 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-gray-800 dark:ring-gray-700/70"
      >
        {options.map((option, i) => (
          <ListboxOption
            key={i}
            value={option}
            className="group relative rounded-sm px-2 py-1.5 select-none data-focus:bg-blue-600"
          >
            <Typography.Small className="block truncate font-normal group-data-focus:text-white group-data-selected:font-semibold">
              {option.label}
            </Typography.Small>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-blue-600 group-data-focus:text-white dark:text-blue-500 [.group:not([data-selected])_&]:hidden">
              <CheckIcon aria-hidden="true" className="size-4" />
            </span>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </div>
  </Listbox>
);
