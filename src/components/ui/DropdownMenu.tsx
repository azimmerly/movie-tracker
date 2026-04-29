import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";

import { Typography } from "@/components/ui/Typography";

type DropdownMenuProps = {
  className?: string;
  text?: string;
  icon?: React.ReactNode;
  header?: React.ReactNode;
  options: ReadonlyArray<{
    hidden?: boolean;
    label: string;
    icon: React.ElementType;
    onClick: () => void;
  }>;
};

export const DropdownMenu = ({
  icon,
  text,
  header,
  options,
  className,
}: DropdownMenuProps) => (
  <Menu
    as="div"
    className={twMerge("relative inline-block text-left", className)}
  >
    {icon || text ? (
      <MenuButton className="group flex cursor-pointer items-center rounded-md focus-visible:outline-2 focus-visible:outline-blue-600 sm:gap-1.75 sm:bg-white sm:px-3 sm:py-2 sm:ring-1 sm:ring-mist-200/70 sm:ring-inset sm:hover:bg-mist-50 sm:dark:bg-mist-900 sm:dark:ring-mist-700/70 sm:dark:hover:bg-mist-800">
        <EllipsisVerticalIcon className="size-5 text-mist-400 hover:text-mist-500 sm:hidden dark:text-mist-500 dark:hover:text-mist-400" />
        <span className="hidden sm:contents">
          {icon}
          {text && (
            <>
              <Typography.Small className="max-w-28 truncate font-medium text-mist-600 dark:text-mist-300">
                {text}
              </Typography.Small>
              <ChevronDownIcon className="size-4 shrink-0 text-mist-400 transition-transform group-data-active:rotate-180" />
            </>
          )}
        </span>
      </MenuButton>
    ) : (
      <MenuButton className="flex cursor-pointer outline-hidden">
        <EllipsisVerticalIcon className="size-5 text-mist-400 hover:text-mist-500 dark:text-mist-500 dark:hover:text-mist-400" />
      </MenuButton>
    )}
    <MenuItems
      transition
      className="absolute right-0 z-10 mt-1.25 min-w-44 origin-top-right rounded-md bg-white p-1 whitespace-nowrap shadow-lg ring-1 ring-mist-200/70 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-mist-900 dark:ring-mist-800"
    >
      {header && (
        <div className="mb-1 border-b border-mist-100 p-2 dark:border-mist-800">
          {header}
        </div>
      )}
      {options.map(
        ({ label, icon: Icon, onClick, hidden }) =>
          !hidden && (
            <MenuItem key={label}>
              <Button
                onClick={onClick}
                className="group flex w-full items-center rounded-sm py-2 pr-6 pl-2 text-sm data-focus:bg-mist-100 dark:data-focus:bg-mist-800"
              >
                <Icon
                  aria-hidden="true"
                  className="mr-1.5 size-4.5 text-mist-400 group-data-focus:text-mist-500 dark:text-mist-500 dark:group-data-focus:text-white"
                />
                {label}
              </Button>
            </MenuItem>
          ),
      )}
    </MenuItems>
  </Menu>
);
