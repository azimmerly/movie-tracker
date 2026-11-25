import { Typography } from "@/components/ui/Typography";

type AuthPromptProps = {
  action: string;
  className?: string;
};

export const AuthPrompt = ({ action, className }: AuthPromptProps) => (
  <Typography.Small muted className={className}>
    <Typography.Link href="/sign-up">Sign up</Typography.Link> or{" "}
    <Typography.Link href="/sign-in">sign in</Typography.Link> to {action}.
  </Typography.Small>
);
