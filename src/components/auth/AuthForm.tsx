"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
  nextPath?: string;
};

export function AuthForm({ mode, nextPath = "/" }: AuthFormProps) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";
  const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          isSignup ? { name, email, password } : { email, password }
        ),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      await refresh();
      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-sage-700">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-400" />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-sage-200 bg-white py-2.5 pl-10 pr-4 text-sm text-sage-900 placeholder:text-sage-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
              placeholder="Jane Smith"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-sage-700">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-400" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-sage-200 bg-white py-2.5 pl-10 pr-4 text-sm text-sage-900 placeholder:text-sage-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-sage-700">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-400" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-sage-200 bg-white py-2.5 pl-10 pr-4 text-sm text-sage-900 placeholder:text-sage-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100"
            placeholder="At least 8 characters"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-forest-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-forest-600/20 transition-colors hover:bg-forest-700 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSignup ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-sm text-sage-500">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-forest-600 hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="font-semibold text-forest-600 hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
