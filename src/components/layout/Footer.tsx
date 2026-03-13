import { Typography } from "@/components/ui/Typography";
import { APP_NAME } from "@/consts";

export const Footer = () => (
  <footer className="w-screen px-2 pt-12 pb-2 text-center">
    <Typography.Tiny muted>
      &copy; {new Date().getFullYear()} {APP_NAME}
    </Typography.Tiny>
  </footer>
);
