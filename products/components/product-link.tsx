"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ProductLinkProps {
  productId: string;
  tab?: "details" | "comments";
  children: ReactNode;
  className?: string;
  preserveQuery?: boolean;
}

export function ProductLink({
  productId,
  tab = "details",
  children,
  className = "",
  preserveQuery = true,
}: ProductLinkProps) {

  const buildHref = () => {
    const baseUrl = preserveQuery
      ? window.location.href.split("?")[0]
      : window.location.pathname;
    const url = new URL(baseUrl, window.location.origin);

    url.searchParams.set("productId", productId);
    url.searchParams.set("tab", tab);

    if (preserveQuery) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.delete("productId");
      currentParams.delete("tab");

      for (const [key, value] of currentParams.entries()) {
        url.searchParams.set(key, value);
      }
    }

    return url.toString().replace(window.location.origin, "");
  };

  return (
    <Link href={buildHref()} className={className} scroll={false}>
      {children}
    </Link>
  );
}
