"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

import { isDemoAccount, setDemoAuth, useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginPageClient() {
  const router = useRouter();
  const { configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!configured) {
      if (!isDemoAccount(email, password)) {
        setError("デモログインの情報が一致しません。");
        setSubmitting(false);
        return;
      }

      setDemoAuth(email);
      window.location.assign("/");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    router.replace("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="surface-card w-full max-w-md border-slate-100 px-8 py-9">
        <div className="inline-flex rounded-3xl bg-[#d9efff] p-4 text-slate-800">
          <LogIn className="size-6" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Login
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Supabase にログイン
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          メールアドレスとパスワードでログインして、自分の会議室データだけ操作できる状態にします。
        </p>
        {!configured ? (
          <div className="mt-6 rounded-2xl bg-[#fff0df] px-4 py-3 text-sm text-slate-700">
            デモ用アカウントは `test@example.com / test1234`、
            `demo@example.com / demo1234`、`guest@example.com / guest1234` です。
          </div>
        ) : null}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              メールアドレス
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="h-12 rounded-2xl bg-white"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              パスワード
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-12 rounded-2xl bg-white"
              placeholder="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? (
            <div className="rounded-2xl bg-[#fff0df] px-4 py-3 text-sm text-slate-700">
              {error}
            </div>
          ) : null}
          <Button
            type="submit"
            className="h-12 w-full rounded-2xl bg-[#d9efff] text-sm font-semibold text-slate-900 hover:bg-[#c9e6ff]"
            disabled={submitting}
          >
            {submitting ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
      </div>
    </div>
  );
}
