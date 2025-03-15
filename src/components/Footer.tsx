import { Typography } from "@/components/ui/Typography";
import { APP_NAME } from "@/consts";

const currentYear = new Date().getFullYear();

export const Footer = () => (
  <footer className="w-screen px-2 pt-8 pb-3 text-center">
    <Typography.Tiny muted>
      &copy; {currentYear} {APP_NAME}
    </Typography.Tiny>
  </footer>
);
