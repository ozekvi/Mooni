"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import MoonIcon from "@/components/ui/MoonIcon";

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get("error");

  const messages: Record<string, string> = {
    OAuthSignin: "Could not start Discord sign-in. Please try again.",
    OAuthCallback: "Discord sign-in failed. Please try again.",
    OAuthAccountNotLinked: "This email is already used with a different sign-in method.",
    Default: "An authentication error occurred.",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.3) 0%, #09030f 60%)" }}>
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6"><MoonIcon size={100} /></div>
        <h1 className="font-display font-bold text-2xl text-purple-200 mb-3">Authentication Error</h1>
        <p className="text-purple-400 font-body mb-8">{messages[error || "Default"] || messages.Default}</p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#7c22d4,#a855f7)" }}>
            Try Again
          </Link>
          <Link href="/"
            className="px-6 py-3 rounded-xl text-sm font-medium border border-purple-800 text-purple-300">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return <Suspense><ErrorContent /></Suspense>;
}
