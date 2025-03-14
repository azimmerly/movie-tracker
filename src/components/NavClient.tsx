"use client";

import {
  Dialog,
  DialogPanel,
  Button as HeadlessButton,
} from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { User } from "better-auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import logoImage from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Typography } from "@/components/ui/Typography";
import { APP_NAME } from "@/consts";
import { pacificoFont } from "@/fonts";
import { authClient } from "@/lib/authClient";

type NavClientProps = {
  user?: User;
  navLinks: ReadonlyArray<{ href: string; label: React.ReactNode }>;
};

export const NavClient = ({ user, navLinks }: NavClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const accountOptions = [
    {
      label: "Account",
      icon: Cog6ToothIcon,
      onClick: () => router.push("/account"),
    },
    {
      label: "Sign out",
      icon: ArrowRightStartOnRectangleIcon,
      onClick: async () => {
        toast.success("Signed out");
        await authClient.signOut();
        router.refresh();
      },
    },
  ] as const;

  return (
    <>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between p-3 sm:px-6">
        <div className="flex items-center gap-16">
          <Link
            href="/"
            className="-m-1 flex items-center gap-1.5 rounded-md p-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden"
          >
            <Image
              draggable={false}
              src={logoImage}
              alt="logo"
              className="size-7"
            />
            <Typography.Large
              className={twMerge(
                "text-xl font-bold tracking-tight sm:text-2xl",
                pacificoFont.className,
              )}
            >
              {APP_NAME}
            </Typography.Large>
          </Link>
          <div className="hidden lg:flex lg:gap-2">
            {navLinks.map(({ label, href }, index) => (
              <Link
                key={index}
                href={href}
                className={twMerge(
                  "rounded-md p-2 text-sm font-semibold hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:hover:bg-gray-800",
                  pathname === href && "bg-gray-100 dark:bg-gray-800",
                )}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <ThemeToggle className="mr-5" />
          <div className="flex lg:hidden">
            <HeadlessButton
              onClick={() => setMobileMenuOpen(true)}
              className="-m-1.5 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </HeadlessButton>
          </div>
          <div className="hidden lg:flex">
            {!user ? (
              <Button
                icon={UserCircleIcon}
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
            ) : (
              <DropdownMenu
                iconButton={<Avatar size="md" userImage={user.image} />}
                options={accountOptions}
              />
            )}
          </div>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <DialogPanel className="bg-offwhite fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-3 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-white/10">
          <div className="flex h-20 items-center justify-between">
            <Link
              href="/"
              className="-m-1 flex items-center gap-1.5 rounded-md p-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                draggable={false}
                src={logoImage}
                alt="logo"
                className="size-7"
              />
              <Typography.Large
                className={twMerge(
                  "text-xl font-bold tracking-tight sm:text-2xl",
                  pacificoFont.className,
                )}
              >
                {APP_NAME}
              </Typography.Large>
            </Link>
            <div className="flex items-center">
              <ThemeToggle className="mr-5" />
              <HeadlessButton
                onClick={() => setMobileMenuOpen(false)}
                className="-m-1.5 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </HeadlessButton>
            </div>
          </div>
          <div className="box-content divide-y divide-gray-200 dark:divide-gray-700">
            <div className="space-y-1.5 py-6 font-medium">
              {navLinks.map(({ label, href }, index) => (
                <Link
                  key={index}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={pathname === href ? "page" : undefined}
                  className="-mx-3 block rounded-md px-3 py-2 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:hover:bg-gray-800"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="py-6">
              {!user ? (
                <Button
                  icon={UserCircleIcon}
                  className="w-full"
                  onClick={() => {
                    router.push("/sign-in");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              ) : (
                <div className="space-y-1.5 font-medium">
                  {accountOptions.map(({ label, icon: Icon, onClick }) => (
                    <HeadlessButton
                      key={label}
                      onClick={() => {
                        onClick();
                        setMobileMenuOpen(false);
                      }}
                      className="-mx-3 box-content flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:hover:bg-gray-800"
                    >
                      <Icon className="size-5" />
                      {label}
                    </HeadlessButton>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};
