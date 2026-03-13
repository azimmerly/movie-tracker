import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useQueryString = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setUrlWithParams = (params: URLSearchParams) => {
    const queryString = params.toString();
    const pathWithQuery = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(pathWithQuery as Route);
  };

  const setQueryParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || !val.length) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    setUrlWithParams(params);
  };

  const clearQueryParam = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    setUrlWithParams(params);
  };

  return { setQueryParams, clearQueryParam };
};
