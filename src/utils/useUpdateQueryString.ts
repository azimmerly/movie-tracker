import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useUpdateQueryString = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.push(`${pathname}?${params.toString()}`);
  };
};
