"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/components/auth/AuthProvider";

type AuthNavProps = {
  variant?: "header" | "mobile";
};

export function AuthNav({ variant = "header" }: AuthNavProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div
        className={clsx(
          "rounded-lg bg-sage-100/60 animate-pulse",
          variant === "header" ? "h-9 w-24" : "h-10 w-full"
        )}
        aria-hidden="true"
      />
    );
  }

  if (user) {
    return (
      <div
        className={clsx(
          "flex items-center",
          variant === "mobile" ? "w-full flex-col gap-2" : "gap-1.5"
        )}
      >
        <Link
          href="/account"
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-lg font-medium text-sage-600 transition-colors hover:text-forest-700",
            variant === "header"
              ? "min-h-11 px-3 text-[13px]"
              : "min-h-11 w-full justify-center border border-sage-200 bg-white px-4 text-sm"
          )}
        >
          <User className="h-4 w-4" />
          Account
        </Link>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/");
            router.refresh();
          }}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-lg font-medium text-sage-500 transition-colors hover:text-forest-700",
            variant === "header"
              ? "min-h-11 px-2 text-[13px]"
              : "min-h-11 w-full justify-center text-sm"
          )}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center",
        variant === "mobile" ? "w-full flex-col gap-2" : "gap-1"
      )}
    >
      <Link
        href="/login"
        className={clsx(
          "inline-flex items-center rounded-lg font-medium text-sage-500 transition-colors hover:text-forest-700",
          variant === "header"
            ? "min-h-11 px-3 text-[13px]"
            : "min-h-11 w-full justify-center border border-sage-200 bg-white px-4 text-sm"
        )}
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className={clsx(
          "inline-flex items-center rounded-lg font-semibold text-white transition-colors",
          variant === "header"
            ? "min-h-11 bg-forest-600 px-3.5 text-[13px] shadow-sm hover:bg-forest-700"
            : "min-h-11 w-full justify-center bg-forest-600 px-4 text-sm shadow-sm hover:bg-forest-700"
        )}
      >
        Sign up
      </Link>
    </div>
  );
}
