"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import MoonIcon from "@/components/ui/MoonIcon";

// Generate stable stars ONCE outside the component
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  width: Math.random() * 2.5 + 0.5,
  height: Math.random() * 2.5 + 0.5,
  top: Math.random() * 100,
  left: Math.random() * 100,
  duration: 2 + Math.random() * 4,
  delay: Math.random() * 3,
  opacity: 0.3 + Math.random() * 0.5,
}));

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const verified = params.get("verified") === "true";

  useEffect(() => {
    setMounted(true);
  }, []);

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
        setError("Пожалуйста, подтвердите email. Проверьте вашу почту.");
      } else if (result?.error) {
        setError("Неверный email или пароль");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDiscordSignIn = useCallback(() => {
    signIn("discord", { callbackUrl: "/dashboard" });
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.4) 0%, #09030f 65%)",
      }}
    >
      {/* Static stars - rendered once, never change */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {mounted && STARS.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              width: star.width,
              height: star.height,
              top: `${star.top}%`,
              left: `${star.left}%`,
              background: `rgba(196, 181, 253, ${star.opacity})`,
              animation: `starTwinkle ${star.duration}s ease-in-out infinite ${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(124,34,212,0.15) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-10%",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(88,28,135,0.1) 0%, transparent 70%)",
        }} />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Card */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(26,10,46,0.97) 0%, rgba(15,5,26,0.99) 100%)",
            border: "1px solid rgba(124,34,212,0.35)",
            boxShadow: "0 0 80px rgba(124,34,212,0.18), 0 25px 70px rgba(0,0,0,0.6), inset 0 1px 0 rgba(192,132,252,0.1)",
          }}
        >
          {/* Top shine */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(192,132,252,0.5), transparent)" }}
          />

          {/* Top glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(124,34,212,0.25) 0%, transparent 70%)" }}
          />

          <div className="relative p-6 sm:p-8 md:p-10">
            {/* Logo section */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-5">
                <MoonIcon size={90} />
              </div>
              <h1
                className="font-display font-bold text-2xl sm:text-3xl tracking-widest mb-1"
                style={{
                  background: "linear-gradient(135deg, #f3e8ff, #c084fc, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                С возвращением
              </h1>
              <p style={{ color: "rgba(167,139,250,0.65)", fontSize: "14px" }}>
                Войдите в аккаунт Mooni Services
              </p>
            </div>

            {/* Alerts */}
            {verified && (
              <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl text-sm"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
                <CheckCircle size={16} className="shrink-0" />
                <span>Email подтверждён! Теперь вы можете войти.</span>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl text-sm"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Discord button */}
            <button
              type="button"
              onClick={handleDiscordSignIn}
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl text-sm font-semibold text-white mb-4 transition-all duration-300 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #5865F2, #7289da)",
                boxShadow: "0 4px 20px rgba(88,101,242,0.35)",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 30px rgba(88,101,242,0.55)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(88,101,242,0.35)")}
            >
              <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="white" aria-hidden="true">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              Войти через Discord
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "rgba(124,34,212,0.3)" }} />
              <span style={{ color: "rgba(124,34,212,0.7)", fontSize: "12px", fontWeight: 500 }}>или</span>
              <div className="flex-1 h-px" style={{ background: "rgba(124,34,212,0.3)" }} />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
              {/* Email */}
              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: "rgba(124,34,212,0.7)" }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Электронная почта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-200"
                  style={{
                    background: "rgba(124,34,212,0.08)",
                    border: "1px solid rgba(124,34,212,0.3)",
                    color: "#e9d5ff",
                    outline: "none",
                  }}
                  onFocus={e => {
                    e.target.style.border = "1px solid rgba(168,85,247,0.7)";
                    e.target.style.background = "rgba(124,34,212,0.12)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)";
                  }}
                  onBlur={e => {
                    e.target.style.border = "1px solid rgba(124,34,212,0.3)";
                    e.target.style.background = "rgba(124,34,212,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(124,34,212,0.7)" }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm transition-all duration-200"
                  style={{
                    background: "rgba(124,34,212,0.08)",
                    border: "1px solid rgba(124,34,212,0.3)",
                    color: "#e9d5ff",
                    outline: "none",
                  }}
                  onFocus={e => {
                    e.target.style.border = "1px solid rgba(168,85,247,0.7)";
                    e.target.style.background = "rgba(124,34,212,0.12)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)";
                  }}
                  onBlur={e => {
                    e.target.style.border = "1px solid rgba(124,34,212,0.3)";
                    e.target.style.background = "rgba(124,34,212,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: "rgba(124,34,212,0.7)" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "#a855f7")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = "rgba(124,34,212,0.7)")}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 mt-2 disabled:opacity-50 active:scale-95"
                style={{
                  background: loading
                    ? "rgba(124,34,212,0.5)"
                    : "linear-gradient(135deg, #7c22d4, #a855f7)",
                  boxShadow: loading ? "none" : "0 4px 25px rgba(168,85,247,0.45)",
                  fontSize: "15px",
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    (e.currentTarget.style.boxShadow = "0 6px 35px rgba(168,85,247,0.65)");
                    (e.currentTarget.style.transform = "translateY(-1px)");
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget.style.boxShadow = "0 4px 25px rgba(168,85,247,0.45)");
                  (e.currentTarget.style.transform = "");
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Входим...
                  </span>
                ) : "Войти"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center mt-6 text-sm" style={{ color: "rgba(124,34,212,0.7)" }}>
              Нет аккаунта?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold transition-colors duration-200"
                style={{ color: "#c084fc" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = "#e9d5ff")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "#c084fc")}
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom glow */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.2) 0%, transparent 70%)" }}
        />
      </div>
    </div>
  );
}
