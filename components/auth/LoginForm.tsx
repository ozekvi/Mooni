"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import MoonIcon from "@/components/ui/MoonIcon";
import StarBackground from "./StarBackground";

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
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error === "EMAIL_NOT_VERIFIED" || result?.error?.includes("NOT_VERIFIED")) {
        setError("Please verify your email first. Check your inbox.");
      } else if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
      background: "radial-gradient(ellipse at 70% 20%, rgba(88,28,135,0.5) 0%, #09030f 55%), radial-gradient(ellipse at 20% 80%, rgba(59,7,100,0.3) 0%, transparent 50%)",
      fontFamily: "'Raleway', sans-serif",
    }}>
      <StarBackground />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
        <div style={{
          borderRadius: 28,
          border: "1px solid rgba(124,34,212,0.3)",
          background: "rgba(10,4,20,0.92)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 0 80px rgba(88,28,135,0.25), 0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}>
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #7c22d4, #c084fc, #7c22d4, transparent)" }} />

          <div style={{ padding: "40px 36px 36px" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <MoonIcon size={72} />
              </div>
              <h1 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 22, fontWeight: 700, letterSpacing: "0.15em",
                background: "linear-gradient(135deg, #f3e8ff, #c084fc, #a855f7)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                margin: "0 0 6px",
              }}>Welcome Back</h1>
              <p style={{ color: "rgba(167,139,250,0.6)", fontSize: 13, margin: 0 }}>
                Sign in to your Mooni account
              </p>
            </div>

            {verified && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px", borderRadius: 12, marginBottom: 20,
                background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
                color: "#6ee7b7", fontSize: 13,
              }}>
                <CheckCircle size={15} /> Email verified! You can now sign in.
              </div>
            )}

            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px", borderRadius: 12, marginBottom: 20,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5", fontSize: 13,
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
              </div>
            )}

            {/* Discord */}
            <button
              type="button"
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                width: "100%", padding: "13px 0", borderRadius: 14,
                background: "linear-gradient(135deg, #4752c4, #5865F2)",
                boxShadow: "0 4px 20px rgba(88,101,242,0.4)",
                color: "white", fontSize: 14, fontWeight: 600,
                cursor: "pointer", border: "none", marginBottom: 20,
              }}>
              <svg width="19" height="19" viewBox="0 0 127.14 96.36" fill="white">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
              Continue with Discord
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(124,34,212,0.25)" }} />
              <span style={{ color: "rgba(124,34,212,0.6)", fontSize: 12, letterSpacing: "0.1em" }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "rgba(124,34,212,0.25)" }} />
            </div>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <FocusField icon={<Mail size={15} />} type="email" placeholder="Email address" value={email} onChange={setEmail} required />
              <FocusField
                icon={<Lock size={15} />}
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={setPassword}
                required
                right={
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(107,33,168,0.7)", display: "flex", padding: 0 }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <button type="submit" disabled={loading} style={{
                marginTop: 6, padding: "14px 0", borderRadius: 14,
                background: loading ? "rgba(124,34,212,0.5)" : "linear-gradient(135deg, #6b21a8, #a855f7)",
                boxShadow: loading ? "none" : "0 0 24px rgba(168,85,247,0.45)",
                color: "white", fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                border: "none", transition: "all 0.2s", letterSpacing: "0.03em",
              }}>
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p style={{ textAlign: "center", color: "rgba(107,33,168,0.8)", fontSize: 13, marginTop: 24 }}>
              Don't have an account?{" "}
              <Link href="/auth/signup" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600 }}>Sign up</Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "rgba(88,28,135,0.6)", fontSize: 12, marginTop: 20, letterSpacing: "0.15em" }}>
          MOONI SERVICES · RISE OF KINGDOMS
        </p>
      </div>
    </div>
  );
}

function FocusField({ icon, type, placeholder, value, onChange, required, right }: {
  icon: React.ReactNode; type: string; placeholder: string;
  value: string; onChange: (v: string) => void; required?: boolean; right?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <span style={{
        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
        color: focused ? "#a855f7" : "rgba(107,33,168,0.7)",
        display: "flex", alignItems: "center", transition: "color 0.2s",
      }}>{icon}</span>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "13px 40px 13px 40px",
          borderRadius: 12,
          background: focused ? "rgba(88,28,135,0.2)" : "rgba(30,0,60,0.4)",
          border: `1.5px solid ${focused ? "rgba(168,85,247,0.7)" : "rgba(88,28,135,0.35)"}`,
          color: "#f3e8ff", fontSize: 14,
          outline: "none", transition: "all 0.2s",
          boxShadow: focused ? "0 0 20px rgba(168,85,247,0.15)" : "none",
          boxSizing: "border-box",
        }}
      />
      {right && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>{right}</span>}
    </div>
  );
}
