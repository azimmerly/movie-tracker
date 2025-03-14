import type { User } from "better-auth";
import Image from "next/image";
import { type ClassNameValue, twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const avatarVariants = tv({
  base: "inline-block overflow-hidden rounded-full shadow bg-gray-200 dark:bg-gray-600 shrink-0",
  variants: {
    size: {
      sm: "size-4",
      md: "size-10",
      lg: "size-14",
    },
  },
});

type AvatarProps = Required<VariantProps<typeof avatarVariants>> & {
  userImage: User["image"];
  className?: ClassNameValue;
};

export const Avatar = ({ userImage, size, className }: AvatarProps) => (
  <span className={twMerge(avatarVariants({ size, className }))}>
    {userImage ? (
      <Image
        src={userImage}
        alt="avatar"
        width={112}
        height={112}
        draggable={false}
      />
    ) : (
      <svg viewBox="0 0 24 24" className="size-full fill-gray-400">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )}
  </span>
);
