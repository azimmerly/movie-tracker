import Image from "next/image";
import { twMerge } from "tailwind-merge";

import { getInitials } from "@/utils/getInitials";

type AvatarProps = {
  name: string;
  image?: string | null;
  className?: string;
};

export const Avatar = ({ image, name, className }: AvatarProps) => {
  const wrapperClassName = twMerge(
    "inline-block shrink-0 overflow-hidden rounded-full shadow-xs",
    className,
  );

  if (image) {
    return (
      <span className={wrapperClassName}>
        <Image
          src={image}
          alt={name}
          width={60}
          height={60}
          draggable={false}
          className="size-full object-cover"
        />
      </span>
    );
  }

  return (
    <span className={wrapperClassName}>
      <svg
        role="img"
        aria-label={name}
        viewBox="0 0 24 24"
        className="size-full bg-mist-200 fill-mist-500 dark:bg-mist-700 dark:fill-mist-300"
      >
        <text
          x="12"
          y="12"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontWeight="600"
        >
          {getInitials(name)}
        </text>
      </svg>
    </span>
  );
};
