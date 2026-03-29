"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import MoonIcon from "@/components/ui/MoonIcon";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verified = params.get("verified") === "true";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error === "EMAIL_NOT_VERIFIED") {
        setError("Please verify your email first. Check your inbox.");
      } else if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.3) 0%, #09030f 60%)",
      }}
    >
      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-300/30"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `starTwinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        <div
          className="relative rounded-3xl border border-purple-900/40 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(26,10,46,0.95) 0%, rgba(9,3,15,0.98) 100%)",
            boxShadow: "0 0 60px rgba(124,34,212,0.2), 0 20px 60px rgba(0,0,0,0.5)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(124,34,212,0.3) 0%, transparent 70%)",
            }}
          />

          <div className="relative p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <MoonIcon size={80} />
              </div>
              <h1
                className="font-display font-bold text-2xl tracking-widest mb-1"
                style={{
                  background: "linear-gradient(135deg, #f3e8ff, #c084fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Welcome Back
              </h1>
              <p className="text-purple-400/70 text-sm font-body">Sign in to your Mooni account</p>
            </div>

            {verified && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-green-900/20 border border-green-800/40 text-green-400 text-sm">
                <CheckCircle size={16} /> Email verified! You can now sign in.
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-900/20 border border-red-800/40 text-red-400 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Discord */}
            <button
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl text-sm font-semibold text-white mb-4 transition-all duration-300 hover:opacity-90"
              style={{ background: "#5865F2", boxShadow: "0 4px 15px rgba(88,101,242,0.3)" }}
            >
              <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="white">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              Continue with Discord
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-purple-900/50" />
              <span className="text-purple-600 text-xs font-body">or</span>
              <div className="flex-1 h-px bg-purple-900/50" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border bg-purple-950/30 text-purple-100 placeholder-purple-700 border-purple-800/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl border bg-purple-950/30 text-purple-100 placeholder-purple-700 border-purple-800/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                  boxShadow: "0 0 20px rgba(168,85,247,0.4)",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-purple-600 text-sm mt-6 font-body">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-purple-400 hover:text-purple-200 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
