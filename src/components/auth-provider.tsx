"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

const DEMO_AUTH_KEY = "meetingroom-demo-auth";
const subscribe = () => () => {};

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
  isGuest: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [sessionVersion, setSessionVersion] = useState(0);
  const session = useMemo(() => {
    void sessionVersion;
    return isHydrated ? readDemoSession() : null;
  }, [isHydrated, sessionVersion]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading: !isHydrated,
      isGuest: session?.user.email === "guest@example.com",
      signOut: async () => {
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(DEMO_AUTH_KEY);
          window.location.assign("/login/");
        }
        setSessionVersion((current) => current + 1);
      },
    }),
    [isHydrated, session],
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
