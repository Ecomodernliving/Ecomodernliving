import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/admin";
import { NewsletterAdminClient } from "./NewsletterAdminClient";

export const metadata: Metadata = {
  title: "Weekly Newsletter",
  robots: { index: false, follow: false },
};

export default async function AdminNewsletterPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/newsletter");
  if (!isAdminEmail(session.email)) redirect("/account");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="mb-8">
        <p className="text-sm text-sage-500">
          <Link href="/account" className="hover:text-forest-800">
            Account
          </Link>
          <span className="mx-1.5">/</span>
          Newsletter
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-950">
          Weekly newsletter
        </h1>
        <p className="mt-2 text-sm text-sage-600">
          Saturday auto-draft from your catalog &amp; FAQs → you approve → Monday
          send. Issues store in Airtable when configured.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-sage-600">Loading…</p>}>
        <NewsletterAdminClient />
      </Suspense>
    </div>
  );
}
