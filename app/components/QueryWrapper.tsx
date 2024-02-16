"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

type QueryWrapperProps = {
  children: React.ReactNode;
};

export const QueryWrapper = ({ children }: QueryWrapperProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
