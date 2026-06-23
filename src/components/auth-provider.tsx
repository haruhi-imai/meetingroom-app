"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

const DEMO_AUTH_KEY = "meetingroom-demo-auth";

export const DEMO_ACCOUNTS = [
  { email: "test@example.com", password: "test1234" },
  { email: "demo@example.com", password: "demo1234" },
  { email: "guest@example.com", password: "guest1234" },
] as const;

export function isDemoAccount(email: string, password: string) {
  return DEMO_ACCOUNTS.some(
    (account) => account.email === email && account.password === password,
  );
}

function createDemoSession(email: string): Session {
  const now = new Date().toISOString();

  const user = {
    id: "demo-user",
    aud: "authenticated",
    role: "authenticated",
    email,
    email_confirmed_at: now,
    phone: "",
    confirmation_sent_at: undefined,
    confirmed_at: now,
    last_sign_in_at: now,
    app_metadata: {},
    user_metadata: {},
    identities: [],
    created_at: now,
    updated_at: now,
    is_anonymous: false,
  } as unknown as User;

  return {
    access_token: "demo-access-token",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: undefined,
    refresh_token: "demo-refresh-token",
    user,
  } as unknown as Session;
}

function readDemoSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const email = window.sessionStorage.getItem(DEMO_AUTH_KEY);

  return email ? createDemoSession(email) : null;
}

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  isGuest: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(() =>
    configured ? null : readDemoSession(),
  );
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(data.session ?? null);
      setLoading(false);
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      startTransition(() => {
        setSession(nextSession ?? null);
        setLoading(false);
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      configured,
      isGuest: session?.user.email === "guest@example.com",
      signOut: async () => {
        if (!configured) {
          if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(DEMO_AUTH_KEY);
            window.location.assign("/login");
          }
          setSession(null);
          return;
        }

        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
      },
    }),
    [configured, loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

export function setDemoAuth(email: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(DEMO_AUTH_KEY, email);
}
