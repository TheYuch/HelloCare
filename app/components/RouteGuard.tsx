'use client';

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_ROUTES = ["/auth", "/onboarding"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublicRoute) {
      router.replace("/auth");
    }
  }, [user, loading, isPublicRoute, router]);

  if (loading) return null;
  if (!user && !isPublicRoute) return null;

  return <>{children}</>;
}
