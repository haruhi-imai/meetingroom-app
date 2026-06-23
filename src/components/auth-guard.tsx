"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LoadingOverlay } from "@/components/loading-overlay";
import { useAuth } from "@/components/auth-provider";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && pathname !== "/login") {
      router.replace("/login");
    }

    if (user && pathname === "/login") {
      router.replace("/");
    }
  }, [loading, pathname, router, user]);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!user && pathname !== "/login") {
    return <LoadingOverlay />;
  }

  if (user && pathname === "/login") {
    return <LoadingOverlay />;
  }

  return <>{children}</>;
}
