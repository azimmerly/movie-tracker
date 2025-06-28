import Image from "next/image";

import ticketImage from "@/assets/ticket.png";
import { Typography } from "@/components/ui/Typography";

export const NoListsMessage = () => (
  <div className="mt-28 text-center">
    <Image
      priority
      draggable={false}
      src={ticketImage}
      alt="movie ticket"
      className="mx-auto size-20"
    />
    <Typography.Body muted className="font-medium">
      No movie lists here… for now.
    </Typography.Body>
  </div>
);
