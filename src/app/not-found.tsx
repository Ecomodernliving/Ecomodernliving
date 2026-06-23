import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-100 text-forest-600">
        <Leaf className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-forest-950">
        Page not found
      </h1>
      <p className="mt-3 text-sage-600">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-white hover:bg-forest-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
    </div>
  );
}
