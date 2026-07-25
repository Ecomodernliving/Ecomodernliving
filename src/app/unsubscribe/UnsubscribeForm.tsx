"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  MailX,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export default function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const initialEmail = useMemo(
    () => (searchParams.get("email") ?? "").trim(),
    [searchParams]
  );

  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/forms/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();

    if (response.ok && result.ok) {
      setStatus("success");
      setMessage(
        result.message ??
          "You've been unsubscribed. You won't receive further newsletter emails."
      );
    } else {
      setStatus("error");
      setMessage(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-90" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-forest-300/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-12rem)] max-w-lg flex-col justify-center px-4 py-14 sm:py-20">
        <div className="overflow-hidden rounded-3xl border border-forest-100/80 bg-white/95 shadow-xl shadow-forest-900/10 backdrop-blur-sm">
          <div className="h-1.5 bg-gradient-to-r from-forest-400 via-emerald-500 to-forest-600" />

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex justify-center"
                aria-label="EcoModern Living home"
              >
                <Logo />
              </Link>

              <div className="mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-500 to-forest-800 text-white shadow-lg shadow-forest-700/25">
                {status === "success" ? (
                  <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
                ) : (
                  <MailX className="h-7 w-7" strokeWidth={1.75} />
                )}
              </div>

              <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-forest-950">
                {status === "success" ? "You're all set" : "Unsubscribe"}
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-sage-600">
                {status === "success"
                  ? "We've removed you from weekly eco living tips. You can still explore the site anytime."
                  : "We'll stop sending weekly eco living tips to this address. You can resubscribe from the homepage later."}
              </p>
            </div>

            {status === "success" ? (
              <div className="mt-8 space-y-5">
                <div className="rounded-2xl border border-forest-100 bg-gradient-to-br from-forest-50 to-cream-50 px-5 py-4 text-sm text-forest-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" />
                    <p className="leading-relaxed">{message}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-forest-700/20 transition-colors hover:bg-forest-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                  </Link>
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-sage-200 bg-white px-5 py-2.5 text-sm font-semibold text-forest-800 transition-colors hover:border-forest-200 hover:bg-forest-50"
                  >
                    Browse marketplace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label
                    htmlFor="unsubscribe-email"
                    className="mb-1.5 block text-sm font-medium text-sage-700"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-400" />
                    <input
                      id="unsubscribe-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "loading"}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-sage-200 bg-cream-50/80 py-3 pl-10 pr-4 text-sm text-sage-800 placeholder:text-sage-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100 disabled:opacity-60"
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    role="alert"
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-forest-900/15 transition-all hover:bg-forest-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {status === "loading" ? "Unsubscribing…" : "Confirm unsubscribe"}
                </button>

                <p className="text-center text-xs text-sage-500">
                  Changed your mind?{" "}
                  <Link
                    href="/#subscribe"
                    className="font-medium text-forest-700 underline-offset-2 hover:underline"
                  >
                    Stay subscribed
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
