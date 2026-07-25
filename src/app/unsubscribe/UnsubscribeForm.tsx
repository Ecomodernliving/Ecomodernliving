"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Leaf } from "lucide-react";

export default function UnsubscribePage() {
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
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-sage-200/80 bg-white p-6 shadow-lg shadow-forest-900/5 sm:p-8">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-forest-500 to-forest-700 text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold text-forest-900">
              EcoModern Living
            </span>
          </Link>
          <h1 className="mt-5 font-display text-2xl font-bold text-forest-950">
            Unsubscribe
          </h1>
          <p className="mt-2 text-sm text-sage-500">
            Stop receiving weekly eco living tips from EcoModern Living.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-xl border border-forest-200 bg-forest-50 px-4 py-4 text-sm text-forest-800">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
              <p>{message}</p>
            </div>
            <Link
              href="/"
              className="mt-4 inline-flex text-sm font-semibold text-forest-700 hover:text-forest-900"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="unsubscribe-email"
                className="mb-1.5 block text-sm font-medium text-sage-700"
              >
                Email address
              </label>
              <input
                id="unsubscribe-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm text-sage-800 placeholder:text-sage-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-100 disabled:opacity-60"
              />
            </div>

            {status === "error" && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center rounded-full bg-forest-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-forest-700 transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "Unsubscribing…" : "Unsubscribe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
