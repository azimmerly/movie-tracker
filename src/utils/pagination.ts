import { notFound } from "next/navigation";

export const parsePage = (page = "1") => {
  const parsed = Number(page);
  if (!Number.isInteger(parsed) || parsed < 1) {
    notFound();
  }
  return parsed;
};

export const getOffset = (page: number, pageSize: number) =>
  pageSize * (page - 1);

export const handleInvalidPage = (
  page: number,
  totalCount: number,
  pageSize: number,
) => {
  if (totalCount > 0 && page > Math.ceil(totalCount / pageSize)) {
    notFound();
  }
};
