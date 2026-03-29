"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import MoonIcon from "@/components/ui/MoonIcon";

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

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirm: "" });
  const [codeArr, setCodeArr] = useState(["", "", "", "", "", ""]);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const codeInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { setMounted(true); }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirm) {
      setError("Пароли не совпадают");
      return;
    }
    if (formData.password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
      setUserId(data.userId);
      setStep("verify");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = codeArr.join("");
    if (code.length < 6) {
      setError("Введите все 6 цифр кода");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка верификации");

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка верификации");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, "").slice(-1);
    const newCode = [...codeArr];
    newCode[index] = val;
    setCodeArr(newCode);
    if (val && index < 5) {
      codeInputs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codeArr[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCodeArr(pasted.split(""));
      codeInputs.current[5]?.focus();
    }
  };

  const handleDiscordSignIn = useCallback(() => {
    signIn("discord", { callbackUrl: "/dashboard" });
  }, []);

  const inputStyle = {
    background: "rgba(124,34,212,0.08)",
    border: "1px solid rgba(124,34,212,0.3)",
    color: "#e9d5ff",
    outline: "none",
  };

  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = "1px solid rgba(168,85,247,0.7)";
    e.target.style.background = "rgba(124,34,212,0.12)";
    e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)";
  };

  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = "1px solid rgba(124,34,212,0.3)";
    e.target.style.background = "rgba(124,34,212,0.08)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.4) 0%, #09030f 65%)" }}
    >
      {/* Stars - stable, never regenerate */}
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

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(124,34,212,0.15) 0%, transparent 70%)",
        }} />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(26,10,46,0.97) 0%, rgba(15,5,26,0.99) 100%)",
            border: "1px solid rgba(124,34,212,0.35)",
            boxShadow: "0 0 80px rgba(124,34,212,0.18), 0 25px 70px rgba(0,0,0,0.6), inset 0 1px 0 rgba(192,132,252,0.1)",
          }}
        >
          {/* Top shine */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(192,132,252,0.5), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(124,34,212,0.25) 0%, transparent 70%)" }} />

          <div className="relative p-6 sm:p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-7">
              <div className="flex justify-center mb-4">
                <MoonIcon size={80} />
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-widest mb-1"
                style={{
                  background: "linear-gradient(135deg, #f3e8ff, #c084fc, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                {step === "form" ? "Создать аккаунт" : "Подтвердите Email"}
              </h1>
              <p style={{ color: "rgba(167,139,250,0.65)", fontSize: "14px" }}>
                {step === "form"
                  ? "Присоединяйтесь к Mooni Services"
                  : `Введите 6-значный код отправленный на ${formData.email}`}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl text-sm"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {step === "form" ? (
              <>
                {/* Discord */}
                <button
                  type="button"
                  onClick={handleDiscordSignIn}
                  className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl text-sm font-semibold text-white mb-4 transition-all duration-300 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #5865F2, #7289da)",
                    boxShadow: "0 4px 20px rgba(88,101,242,0.35)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="white">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                  Войти через Discord
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px" style={{ background: "rgba(124,34,212,0.3)" }} />
                  <span style={{ color: "rgba(124,34,212,0.7)", fontSize: "12px" }}>или</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(124,34,212,0.3)" }} />
                </div>

                <form onSubmit={handleRegister} className="space-y-3.5" autoComplete="on">
                  {/* Name */}
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(124,34,212,0.7)" }} />
                    <input
                      type="text" name="name" placeholder="Отображаемое имя"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      autoComplete="name"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-200"
                      style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(124,34,212,0.7)" }} />
                    <input
                      type="email" name="email" placeholder="Электронная почта"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required autoComplete="email"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-200"
                      style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(124,34,212,0.7)" }} />
                    <input
                      type={showPass ? "text" : "password"} name="password"
                      placeholder="Пароль (мин. 8 символов)"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      required autoComplete="new-password"
                      className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm transition-all duration-200"
                      style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: "rgba(124,34,212,0.7)" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Confirm */}
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(124,34,212,0.7)" }} />
                    <input
                      type={showConfirm ? "text" : "password"} name="confirm-password"
                      placeholder="Подтвердите пароль"
                      value={formData.confirm}
                      onChange={e => setFormData({ ...formData, confirm: e.target.value })}
                      required autoComplete="new-password"
                      className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm transition-all duration-200"
                      style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: "rgba(124,34,212,0.7)" }}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 mt-1 disabled:opacity-50 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                      boxShadow: "0 4px 25px rgba(168,85,247,0.45)",
                      fontSize: "15px",
                    }}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Создаём аккаунт...
                      </span>
                    ) : "Создать аккаунт"}
                  </button>
                </form>
              </>
            ) : (
              /* Verification step */
              <form onSubmit={handleVerify} className="space-y-6">
                {/* Code inputs */}
                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleCodePaste}>
                  {codeArr.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { codeInputs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={e => handleCodeChange(i, e.target.value)}
                      onKeyDown={e => handleCodeKeyDown(i, e)}
                      className="w-10 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl transition-all duration-200"
                      style={{
                        background: digit ? "rgba(168,85,247,0.2)" : "rgba(124,34,212,0.08)",
                        border: digit ? "2px solid rgba(168,85,247,0.7)" : "2px solid rgba(124,34,212,0.3)",
                        color: "#e9d5ff",
                        outline: "none",
                        boxShadow: digit ? "0 0 15px rgba(168,85,247,0.2)" : "none",
                      }}
                      onFocus={e => {
                        e.target.style.border = "2px solid rgba(168,85,247,0.8)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.15)";
                      }}
                      onBlur={e => {
                        e.target.style.border = digit ? "2px solid rgba(168,85,247,0.7)" : "2px solid rgba(124,34,212,0.3)";
                        e.target.style.boxShadow = digit ? "0 0 15px rgba(168,85,247,0.2)" : "none";
                      }}
                    />
                  ))}
                </div>

                <p className="text-center text-sm" style={{ color: "rgba(167,139,250,0.5)" }}>
                  Код действителен <strong style={{ color: "rgba(167,139,250,0.8)" }}>15 минут</strong>
                </p>

                <button
                  type="submit"
                  disabled={loading || codeArr.join("").length < 6}
                  className="w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-50 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                    boxShadow: "0 4px 25px rgba(168,85,247,0.45)",
                    fontSize: "15px",
                  }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Проверяем...
                    </span>
                  ) : "Подтвердить и войти"}
                </button>

                <p className="text-center text-sm" style={{ color: "rgba(124,34,212,0.6)" }}>
                  Не получили код?{" "}
                  <button
                    type="button"
                    className="font-medium transition-colors duration-200"
                    style={{ color: "#c084fc" }}
                    onClick={() => {
                      setStep("form");
                      setError("");
                      setCodeArr(["", "", "", "", "", ""]);
                    }}
                  >
                    Зарегистрироваться снова
                  </button>
                </p>
              </form>
            )}

            <p className="text-center text-sm mt-6" style={{ color: "rgba(124,34,212,0.7)" }}>
              {step === "form" ? (
                <>
                  Уже есть аккаунт?{" "}
                  <Link href="/auth/login" className="font-semibold" style={{ color: "#c084fc" }}>
                    Войти
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  className="font-medium"
                  style={{ color: "#a78bfa" }}
                  onClick={() => { setStep("form"); setError(""); }}
                >
                  ← Вернуться
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
