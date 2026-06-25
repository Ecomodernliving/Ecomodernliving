import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your EcoModern Living account.",
};

export default function SignupPage() {
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-sage-500">
            Join for courses, tools, and personalized eco home guidance.
          </p>
        </div>

        <AuthForm mode="signup" nextPath="/account" />
      </div>
    </div>
  );
}
