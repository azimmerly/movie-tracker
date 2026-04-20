import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useQueryString = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = (params: URLSearchParams, push: boolean) => {
    const queryString = params.toString();
    const pathWithQuery = queryString ? `${pathname}?${queryString}` : pathname;
    if (push) {
      router.push(pathWithQuery as Route);
    } else {
      router.replace(pathWithQuery as Route);
    }
  };

  const setQueryParams = (
    newParams: Record<string, string | null>,
    push = false,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || !val.length) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    navigate(params, push);
  };

  return { setQueryParams };
};
