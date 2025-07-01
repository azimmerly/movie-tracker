import Image from "next/image";

import ticketImage from "@/assets/ticket.png";
import { Typography } from "@/components/ui/Typography";

type NothingFoundProps = {
  text: string;
};

export const NothingFound = ({ text }: NothingFoundProps) => (
  <div className="mt-28 text-center">
    <Image
      priority
      draggable={false}
      src={ticketImage}
      alt="movie ticket"
      className="mx-auto size-20"
    />
    <Typography.Body muted className="font-medium">
      {text}
    </Typography.Body>
  </div>
);
