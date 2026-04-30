import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useQueryString = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQueryParams = (
    newParams: Record<string, string | null>,
    method: "push" | "replace" = "replace",
  ) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (!val) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    const updatedParams = params.toString();
    const route = updatedParams ? `${pathname}?${updatedParams}` : pathname;
    router[method](route as Route);
  };

  return { setQueryParams };
};
