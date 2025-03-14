import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { twMerge, type ClassNameValue } from "tailwind-merge";

import { Typography } from "@/components/ui/Typography";

type DropdownMenuWithButtonTextProps = {
  buttonText: string;
  iconButton?: never;
  ellipsisOnMobile?: boolean;
};

type DropdownMenuWithIconButtonProps = {
  iconButton: React.ReactNode;
  buttonText?: never;
  ellipsisOnMobile?: never;
};

type DropdownMenuProps = {
  options: ReadonlyArray<{
    hidden?: boolean;
    label: string;
    icon: React.ElementType;
    onClick: () => void;
  }>;
  className?: ClassNameValue;
} & (DropdownMenuWithButtonTextProps | DropdownMenuWithIconButtonProps);

export const DropdownMenu = ({
  buttonText,
  iconButton,
  options,
  className,
  ellipsisOnMobile,
}: DropdownMenuProps) => (
  <Menu
    as="div"
    className={twMerge("relative inline-block text-left", className)}
  >
    {iconButton ? (
      <MenuButton className="flex cursor-pointer rounded-full hover:brightness-[98%] focus-visible:outline-2 focus-visible:outline-blue-500 dark:hover:brightness-105">
        {iconButton}
      </MenuButton>
    ) : (
      <MenuButton className="group cursor-pointer justify-center rounded-md focus:outline-2 focus:outline-blue-500">
        <span
          className={twMerge(
            "gap-1 rounded-md bg-white px-3 py-2 shadow-xs ring-1 ring-gray-200/70 ring-inset hover:bg-gray-50 dark:bg-gray-800 dark:ring-gray-700/70 dark:hover:bg-gray-700",
            ellipsisOnMobile ? "hidden sm:flex" : "flex",
          )}
        >
          <Typography.Small className="font-medium text-gray-600 dark:text-gray-300">
            {buttonText}
          </Typography.Small>
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-500 transition-transform group-data-active:rotate-180"
          />
        </span>
        <span className={twMerge(ellipsisOnMobile ? "sm:hidden" : "hidden")}>
          <span className="sr-only">{buttonText}</span>
          <EllipsisVerticalIcon className="size-6 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-600" />
        </span>
      </MenuButton>
    )}
    <MenuItems
      transition
      className="absolute right-0 z-10 mt-1.5 min-w-36 origin-top-right rounded-md bg-white p-1 whitespace-nowrap shadow-lg ring-1 ring-gray-200/70 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:ring-gray-700/70"
    >
      {options.map(
        ({ label, icon: Icon, onClick, hidden }) =>
          !hidden && (
            <MenuItem key={label}>
              <Button
                onClick={onClick}
                className="flex w-full cursor-pointer items-center rounded-sm py-2 pr-6 pl-2 text-sm data-focus:bg-gray-50 dark:data-focus:bg-gray-700"
              >
                <Icon aria-hidden="true" className="mr-1.5 size-[18px]" />
                {label}
              </Button>
            </MenuItem>
          ),
      )}
    </MenuItems>
  </Menu>
);
