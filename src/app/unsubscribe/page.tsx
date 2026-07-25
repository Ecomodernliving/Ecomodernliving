import type { Metadata } from "next";
import { Suspense } from "react";
import UnsubscribeForm from "./UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from EcoModern Living newsletter emails.",
  robots: { index: false, follow: false },
};

function UnsubscribeFallback() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-90" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[calc(100vh-12rem)] max-w-lg items-center justify-center px-4 py-14 text-sm text-sage-500">
        Loading…
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<UnsubscribeFallback />}>
      <UnsubscribeForm />
    </Suspense>
  );
}
