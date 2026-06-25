import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, User } from "lucide-react";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "My Account",
  description: "Your EcoModern Living account.",
};

export default async function AccountPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-sage-200/80 bg-white p-6 shadow-lg shadow-forest-900/5 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 text-white shadow-md">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-forest-950">
              {user.name}
            </h1>
            <p className="mt-1 text-sm text-sage-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/ai/energy-audit"
            className="group flex items-center justify-between rounded-xl border border-sage-200 bg-cream-50 px-4 py-3.5 text-sm font-medium text-forest-800 transition-colors hover:border-forest-200 hover:bg-forest-50"
          >
            Energy Audit
            <ArrowRight className="h-4 w-4 text-sage-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/community/newsletter"
            className="group flex items-center justify-between rounded-xl border border-sage-200 bg-cream-50 px-4 py-3.5 text-sm font-medium text-forest-800 transition-colors hover:border-forest-200 hover:bg-forest-50"
          >
            Newsletter
            <ArrowRight className="h-4 w-4 text-sage-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/services/courses"
            className="group flex items-center justify-between rounded-xl border border-sage-200 bg-cream-50 px-4 py-3.5 text-sm font-medium text-forest-800 transition-colors hover:border-forest-200 hover:bg-forest-50"
          >
            Online Courses
            <ArrowRight className="h-4 w-4 text-sage-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/marketplace"
            className="group flex items-center justify-between rounded-xl border border-sage-200 bg-cream-50 px-4 py-3.5 text-sm font-medium text-forest-800 transition-colors hover:border-forest-200 hover:bg-forest-50"
          >
            Marketplace
            <ArrowRight className="h-4 w-4 text-sage-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
