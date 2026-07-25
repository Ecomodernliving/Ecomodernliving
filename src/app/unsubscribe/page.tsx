import type { Metadata } from "next";
import { Suspense } from "react";
import UnsubscribeForm from "./UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from EcoModern Living newsletter emails.",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md items-center justify-center px-4 py-12 text-sm text-sage-500">
          Loading…
        </div>
      }
    >
      <UnsubscribeForm />
    </Suspense>
  );
}
