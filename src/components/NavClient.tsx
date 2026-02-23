"use client";

import {
  Dialog,
  DialogPanel,
  Button as HeadlessButton,
} from "@headlessui/react";
import {
  HomeIcon,
  ListBulletIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/16/solid";
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
};

const navLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/dashboard", label: "My Lists", icon: ListBulletIcon },
] as const;

export const NavClient = ({ user }: NavClientProps) => {
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
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between p-3.5 sm:px-6">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="-m-1 flex items-center gap-1.5 rounded-md p-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden"
          >
            <Image
              draggable={false}
              src={logoImage}
              alt="logo"
              className="size-6.5 sm:size-7"
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
          <div className="hidden lg:flex lg:gap-1.5">
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={twMerge(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold hover:bg-mist-200/60 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:hover:bg-mist-800/70",
                  pathname === href && "bg-mist-200/60 dark:bg-mist-800/70",
                )}
                aria-current={pathname === href ? "page" : undefined}
              >
                <Icon className="size-4 text-blue-600/60 dark:text-blue-500/60" />
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
              className="-m-1.5 rounded-md p-1.5 text-mist-500 hover:bg-mist-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:text-mist-400 dark:hover:bg-mist-800"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </HeadlessButton>
          </div>
          <div className="hidden lg:flex">
            {!user ? (
              <div className="flex gap-2">
                <Button
                  icon={UserCircleIcon}
                  onClick={() => router.push("/sign-in")}
                >
                  Sign in
                </Button>
                <Button
                  variant="secondary"
                  icon={UserPlusIcon}
                  onClick={() => router.push("/sign-up")}
                >
                  Create account
                </Button>
              </div>
            ) : (
              <DropdownMenu
                iconButton={<Avatar size="lg" userImage={user.image} />}
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
        <DialogPanel className="bg-offwhite fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-3.5 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-mist-900/10 dark:bg-mist-950 dark:sm:ring-mist-800">
          <div className="flex h-20 items-center justify-between sm:justify-end">
            <Link
              href="/"
              className="-m-1 flex items-center gap-1.5 rounded-md p-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                draggable={false}
                src={logoImage}
                alt="logo"
                className="size-6.5 sm:size-7"
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
                className="-m-1.5 rounded-md p-1.5 text-mist-500 hover:bg-mist-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:text-mist-400 dark:hover:bg-mist-800"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </HeadlessButton>
            </div>
          </div>
          <div className="box-content divide-y divide-mist-200 dark:divide-mist-800">
            <div className="space-y-1.5 py-4 font-medium">
              {navLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={pathname === href ? "page" : undefined}
                  className={twMerge(
                    "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-mist-200/60 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:hover:bg-mist-800/70",
                    pathname === href && "bg-mist-200/60 dark:bg-mist-800/70",
                  )}
                >
                  <Icon className="size-4 text-blue-600/60 dark:text-blue-500/60" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="py-4">
              {!user ? (
                <div className="flex flex-col gap-3">
                  <Button
                    icon={UserCircleIcon}
                    className="w-full"
                    onClick={() => {
                      router.push("/sign-in");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    icon={UserPlusIcon}
                    className="w-full"
                    variant="secondary"
                    onClick={() => {
                      router.push("/sign-up");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Create account
                  </Button>
                </div>
              ) : (
                <div className="space-y-1.5 font-medium">
                  {accountOptions.map(({ label, icon: Icon, onClick }) => (
                    <HeadlessButton
                      key={label}
                      onClick={() => {
                        onClick();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-mist-200/60 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden dark:hover:bg-mist-800/70"
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
