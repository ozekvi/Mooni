"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import MoonIcon from "@/components/ui/MoonIcon";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirm: "" });
  const [code, setCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUserId(data.userId);
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Auto sign-in
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login?verified=true");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
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
      {/* Stars bg */}
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
        {/* Card */}
        <div
          className="relative rounded-3xl border border-purple-900/40 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(26,10,46,0.95) 0%, rgba(9,3,15,0.98) 100%)",
            boxShadow: "0 0 60px rgba(124,34,212,0.2), 0 20px 60px rgba(0,0,0,0.5)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Top glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(124,34,212,0.3) 0%, transparent 70%)",
            }}
          />

          <div className="relative p-8">
            {/* Header */}
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
                {step === "form" ? "Create Account" : "Verify Email"}
              </h1>
              <p className="text-purple-400/70 text-sm font-body">
                {step === "form"
                  ? "Join the Mooni community"
                  : `Enter the 6-digit code sent to ${formData.email}`}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-900/20 border border-red-800/40 text-red-400 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {step === "form" ? (
              <>
                {/* Discord login */}
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

                {/* Email form */}
                <form onSubmit={handleRegister} className="space-y-4">
                  <InputField
                    icon={<User size={16} />}
                    type="text"
                    placeholder="Display name"
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                  />
                  <InputField
                    icon={<Mail size={16} />}
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(v) => setFormData({ ...formData, email: v })}
                    required
                  />
                  <InputField
                    icon={<Lock size={16} />}
                    type={showPass ? "text" : "password"}
                    placeholder="Password (min 8 chars)"
                    value={formData.password}
                    onChange={(v) => setFormData({ ...formData, password: v })}
                    required
                    rightIcon={
                      <button type="button" onClick={() => setShowPass(!showPass)} className="text-purple-500 hover:text-purple-300">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                  <InputField
                    icon={<Lock size={16} />}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirm}
                    onChange={(v) => setFormData({ ...formData, confirm: v })}
                    required
                    rightIcon={
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-purple-500 hover:text-purple-300">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                      boxShadow: "0 0 20px rgba(168,85,247,0.4)",
                    }}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </form>
              </>
            ) : (
              /* Verification step */
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={code[i] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/, "");
                        const newCode = code.split("");
                        newCode[i] = val;
                        setCode(newCode.join(""));
                        if (val && i < 5) {
                          const next = document.getElementById(`code-${i + 1}`);
                          next?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !code[i] && i > 0) {
                          const prev = document.getElementById(`code-${i - 1}`);
                          prev?.focus();
                        }
                      }}
                      id={`code-${i}`}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-xl border bg-purple-950/40 text-purple-100 border-purple-800/60 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || code.length < 6}
                  className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                    boxShadow: "0 0 20px rgba(168,85,247,0.4)",
                  }}
                >
                  {loading ? "Verifying..." : "Verify & Enter"}
                </button>

                <p className="text-center text-purple-500 text-xs">
                  Didn't receive the code?{" "}
                  <button type="button" className="text-purple-400 hover:text-purple-200 underline">
                    Resend
                  </button>
                </p>
              </form>
            )}

            {/* Footer */}
            <p className="text-center text-purple-600 text-sm mt-6 font-body">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-200 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon,
  type,
  placeholder,
  value,
  onChange,
  required,
  rightIcon,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full pl-10 pr-10 py-3.5 rounded-xl border bg-purple-950/30 text-purple-100 placeholder-purple-700 border-purple-800/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
      />
      {rightIcon && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightIcon}</span>
      )}
    </div>
  );
}
