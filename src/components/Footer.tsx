import { Typography } from "@/components/ui/Typography";
import { APP_NAME } from "@/consts";

const currentYear = new Date().getFullYear();

export const Footer = () => (
  <footer className="w-screen px-4 py-6 text-center sm:py-8">
    <Typography.Tiny muted>
      &copy; {currentYear} {APP_NAME}
    </Typography.Tiny>
  </footer>
);
