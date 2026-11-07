"use client";

import { useRouter } from "next/navigation";
import { toGuideHref } from "@/lib";
import Pagination from "../ui/Pagination";

type GuidePaginationProps = {
  city?: string;
  page: number;
  pageCount: number;
};

const GuidePagination = ({ city, page, pageCount }: GuidePaginationProps) => {
  const router = useRouter();

  return (
    <Pagination page={page} pageCount={pageCount} onChange={(nextPage) => router.push(`${toGuideHref({ city, page: nextPage })}#all`)} />
  );
};

export default GuidePagination;
