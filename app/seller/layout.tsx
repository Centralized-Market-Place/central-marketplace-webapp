"use client";

import { useAuthContext } from "@/providers/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/auth/shema";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const publicSellerRoutes = ["/seller/apply", "/seller/applications"];
  const isPublicSellerRoute = publicSellerRoutes.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (
        !isPublicSellerRoute &&
        user &&
        user.role !== UserRole.Enum.SELLER &&
        user.role !== UserRole.Enum.ADMIN &&
        user.role !== UserRole.Enum.SUPER_ADMIN
      ) {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, loading, user, router, isPublicSellerRoute]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (isPublicSellerRoute) {
    return <>{children}</>;
  }

  if (
    user.role !== UserRole.Enum.SELLER &&
    user.role !== UserRole.Enum.ADMIN &&
    user.role !== UserRole.Enum.SUPER_ADMIN
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You need to be a seller to access this section.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
