"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import MoonIcon from "@/components/ui/MoonIcon";
import StarBackground from "./StarBackground";

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState(Array(6).fill(""));
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setUserId(data.userId);
      setStep("verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const fullCode = code.join("");
    if (fullCode.length < 6) { setError("Enter all 6 digits"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: fullCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.ok) router.push("/dashboard");
      else router.push("/auth/login?verified=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) {
      document.getElementById(`c${i + 1}`)?.focus();
    }
  };

  const handleCodeKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      document.getElementById(`c${i - 1}`)?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      document.getElementById("c5")?.focus();
    }
    e.preventDefault();
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
      background: "radial-gradient(ellipse at 30% 20%, rgba(88,28,135,0.5) 0%, #09030f 55%), radial-gradient(ellipse at 80% 80%, rgba(59,7,100,0.3) 0%, transparent 50%)",
      fontFamily: "'Raleway', sans-serif",
    }}>
      <StarBackground />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>
        <div style={{
          borderRadius: 28,
          border: "1px solid rgba(124,34,212,0.3)",
          background: "rgba(10,4,20,0.92)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 0 80px rgba(88,28,135,0.25), 0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}>
          {/* Purple top glow line */}
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
              }}>
                {step === "form" ? "Create Account" : "Verify Email"}
              </h1>
              <p style={{ color: "rgba(167,139,250,0.6)", fontSize: 13, margin: 0 }}>
                {step === "form" ? "Join the Mooni community" : `Code sent to ${email}`}
              </p>
            </div>

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

            {step === "form" ? <>
              {/* Discord button */}
              <button
                type="button"
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  width: "100%", padding: "13px 0", borderRadius: 14,
                  background: "linear-gradient(135deg, #4752c4, #5865F2)",
                  boxShadow: "0 4px 20px rgba(88,101,242,0.4)",
                  color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  border: "none", marginBottom: 20,
                }}>
                <svg width="19" height="19" viewBox="0 0 127.14 96.36" fill="white">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
                Continue with Discord
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(124,34,212,0.25)" }} />
                <span style={{ color: "rgba(124,34,212,0.6)", fontSize: 12, letterSpacing: "0.1em" }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "rgba(124,34,212,0.25)" }} />
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field icon={<User size={15} />} type="text" placeholder="Display name" value={name} onChange={setName} />
                <Field icon={<Mail size={15} />} type="email" placeholder="Email address" value={email} onChange={setEmail} required />
                <Field icon={<Lock size={15} />} type={showPass ? "text" : "password"} placeholder="Password (min. 8 chars)" value={password} onChange={setPassword} required
                  right={<ToggleEye show={showPass} onToggle={() => setShowPass(!showPass)} />} />
                <Field icon={<Lock size={15} />} type={showConfirm ? "text" : "password"} placeholder="Confirm password" value={confirm} onChange={setConfirm} required
                  right={<ToggleEye show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />} />

                <button type="submit" disabled={loading} style={{
                  marginTop: 6, padding: "14px 0", borderRadius: 14,
                  background: loading ? "rgba(124,34,212,0.5)" : "linear-gradient(135deg, #6b21a8, #a855f7)",
                  boxShadow: loading ? "none" : "0 0 24px rgba(168,85,247,0.45)",
                  color: "white", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                  border: "none", transition: "all 0.2s", letterSpacing: "0.03em",
                }}>
                  {loading ? "Creating…" : "Create Account"}
                </button>
              </form>
            </> : (
              /* Verify step */
              <form onSubmit={handleVerify}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <p style={{ color: "rgba(167,139,250,0.7)", fontSize: 13, lineHeight: 1.6 }}>
                    Enter the 6-digit code we sent to your inbox. Check spam if needed.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }} onPaste={handleCodePaste}>
                  {code.map((d, i) => (
                    <input
                      key={i}
                      id={`c${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleCodeInput(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKey(i, e)}
                      style={{
                        width: 52, height: 60, textAlign: "center",
                        fontSize: 26, fontWeight: 700,
                        fontFamily: "'Cinzel', serif",
                        background: "rgba(88,28,135,0.15)",
                        border: `2px solid ${d ? "rgba(168,85,247,0.8)" : "rgba(88,28,135,0.4)"}`,
                        borderRadius: 14, color: "#f3e8ff",
                        outline: "none",
                        transition: "border-color 0.2s",
                        boxShadow: d ? "0 0 16px rgba(168,85,247,0.3)" : "none",
                      }}
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading || code.join("").length < 6} style={{
                  width: "100%", padding: "14px 0", borderRadius: 14,
                  background: code.join("").length < 6 ? "rgba(124,34,212,0.3)" : "linear-gradient(135deg, #6b21a8, #a855f7)",
                  boxShadow: code.join("").length < 6 ? "none" : "0 0 24px rgba(168,85,247,0.45)",
                  color: "white", fontSize: 15, fontWeight: 600,
                  cursor: loading || code.join("").length < 6 ? "not-allowed" : "pointer",
                  border: "none", letterSpacing: "0.03em",
                }}>
                  {loading ? "Verifying…" : "Verify & Enter ✦"}
                </button>

                <p style={{ textAlign: "center", color: "rgba(107,33,168,0.8)", fontSize: 13, marginTop: 18 }}>
                  Wrong email?{" "}
                  <button type="button" onClick={() => setStep("form")}
                    style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>
                    Go back
                  </button>
                </p>
              </form>
            )}

            <p style={{ textAlign: "center", color: "rgba(107,33,168,0.8)", fontSize: 13, marginTop: 24 }}>
              Already have an account?{" "}
              <Link href="/auth/login" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </div>

        {/* Bottom shimmer text */}
        <p style={{ textAlign: "center", color: "rgba(88,28,135,0.6)", fontSize: 12, marginTop: 20, letterSpacing: "0.15em" }}>
          MOONI SERVICES · RISE OF KINGDOMS
        </p>
      </div>
    </div>
  );
}

function Field({ icon, type, placeholder, value, onChange, required, right }: {
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
        type={type}
        placeholder={placeholder}
        value={value}
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
          outline: "none",
          transition: "all 0.2s",
          boxShadow: focused ? "0 0 20px rgba(168,85,247,0.15)" : "none",
          boxSizing: "border-box",
        }}
      />
      {right && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>{right}</span>}
    </div>
  );
}

function ToggleEye({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(107,33,168,0.7)", display: "flex", padding: 0 }}>
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );
}
