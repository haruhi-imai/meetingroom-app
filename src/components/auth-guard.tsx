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
  const isLoginPath = pathname === "/login" || pathname === "/login/";

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && !isLoginPath) {
      router.replace("/login/");
      window.setTimeout(() => {
        if (window.location.pathname !== "/login/") {
          window.location.replace("/login/");
        }
      }, 500);
    }

    if (user && isLoginPath) {
      router.replace("/");
      window.setTimeout(() => {
        if (
          window.location.pathname === "/login" ||
          window.location.pathname === "/login/"
        ) {
          window.location.replace("/");
        }
      }, 500);
    }
  }, [isLoginPath, loading, router, user]);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!user && !isLoginPath) {
    return <LoadingOverlay />;
  }

  if (user && isLoginPath) {
    return <LoadingOverlay />;
  }

  return <>{children}</>;
}
