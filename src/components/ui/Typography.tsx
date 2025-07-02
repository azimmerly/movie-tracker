import NextLink, { type LinkProps } from "next/link";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const typographyVariants = tv({
  base: "antialiased text-pretty break-words",
  variants: {
    type: {
      h1: "text-3xl font-extrabold tracking-tight sm:text-4xl",
      h2: "text-2xl font-bold tracking-tight sm:text-3xl",
      h3: "text-xl font-bold tracking-tight sm:text-2xl",
      large: "text-lg font-semibold",
      body: "text-base leading-7",
      small: "text-sm block",
      tiny: "text-xs block",
      link: "font-semibold outline-hidden focus-visible:underline underline-offset-2",
    },
    muted: {
      true: "text-gray-500 dark:text-gray-400",
      false: "text-gray-900 dark:text-white",
    },
  },
  compoundVariants: [
    {
      type: "link",
      class:
        "text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300",
    },
  ],
});

type TypographyProps = Omit<VariantProps<typeof typographyVariants>, "type">;

const H1 = ({
  muted,
  children,
  className,
}: React.HTMLAttributes<HTMLHeadingElement> & TypographyProps) => (
  <h1 className={twMerge(typographyVariants({ type: "h1", muted, className }))}>
    {children}
  </h1>
);

const H2 = ({
  muted,
  children,
  className,
}: React.HTMLAttributes<HTMLHeadingElement> & TypographyProps) => (
  <h2 className={twMerge(typographyVariants({ type: "h2", muted, className }))}>
    {children}
  </h2>
);

const H3 = ({
  muted,
  children,
  className,
}: React.HTMLAttributes<HTMLHeadingElement> & TypographyProps) => (
  <h3 className={twMerge(typographyVariants({ type: "h3", muted, className }))}>
    {children}
  </h3>
);

const Body = ({
  muted,
  children,
  className,
}: React.HTMLAttributes<HTMLParagraphElement> & TypographyProps) => (
  <p
    className={twMerge(typographyVariants({ type: "body", muted, className }))}
  >
    {children}
  </p>
);

const Large = ({
  muted,
  children,
  className,
}: React.HTMLAttributes<HTMLParagraphElement> & TypographyProps) => (
  <p
    className={twMerge(typographyVariants({ type: "large", muted, className }))}
  >
    {children}
  </p>
);

const Small = ({
  muted,
  children,
  className,
}: React.HTMLAttributes<HTMLParagraphElement> & TypographyProps) => (
  <small
    className={twMerge(typographyVariants({ type: "small", muted, className }))}
  >
    {children}
  </small>
);

const Tiny = ({
  muted,
  children,
  className,
}: React.HTMLAttributes<HTMLParagraphElement> & TypographyProps) => (
  <small
    className={twMerge(typographyVariants({ type: "tiny", muted, className }))}
  >
    {children}
  </small>
);

const Link = ({
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps) => (
  <NextLink
    {...props}
    className={twMerge(typographyVariants({ type: "link", className }))}
  >
    {children}
  </NextLink>
);

export const Typography = { H1, H2, H3, Body, Large, Small, Tiny, Link };
