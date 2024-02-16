import { FaTriangleExclamation } from "react-icons/fa6";

export const ValidationError = ({ text }: { text: string }) => (
  <span className="flex w-fit items-center gap-1.5 rounded-md bg-red-50 px-2 py-0.5 text-xs text-red-600">
    <FaTriangleExclamation className="h-2.5 w-2.5" />
    {text}
  </span>
);
