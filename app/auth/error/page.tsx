"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import MoonIcon from "@/components/ui/MoonIcon";
import { AlertTriangle } from "lucide-react";

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  OAuthSignin: {
    title: "Ошибка входа через Discord",
    desc: "Не удалось начать процесс входа через Discord. Убедитесь, что ваш аккаунт Discord активен и попробуйте снова.",
  },
  OAuthCallback: {
    title: "Ошибка обратного вызова Discord",
    desc: "Discord вернул ошибку во время авторизации. Это может быть временная проблема — попробуйте ещё раз.",
  },
  OAuthAccountNotLinked: {
    title: "Аккаунт уже существует",
    desc: "Email от вашего Discord аккаунта уже используется с другим методом входа. Попробуйте войти через email/пароль.",
  },
  Callback: {
    title: "Ошибка авторизации",
    desc: "Произошла ошибка при обработке вашего входа. Пожалуйста, попробуйте снова.",
  },
  AccessDenied: {
    title: "Доступ запрещён",
    desc: "У вас нет доступа к этому ресурсу.",
  },
  Verification: {
    title: "Ошибка верификации",
    desc: "Ссылка для верификации недействительна или устарела.",
  },
  Default: {
    title: "Ошибка аутентификации",
    desc: "Произошла неизвестная ошибка. Пожалуйста, попробуйте снова или обратитесь в поддержку.",
  },
};

function ErrorContent() {
  const params = useSearchParams();
  const errorKey = params.get("error") || "Default";
  const errorInfo = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.Default;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.3) 0%, #09030f 60%)",
      }}
    >
      {/* Background stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {Array.from({ length: 40 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-300/20"
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

      <div className="relative w-full max-w-md z-10 text-center">
        <div
          className="relative rounded-3xl overflow-hidden p-8 sm:p-10"
          style={{
            background: "linear-gradient(145deg, rgba(26,10,46,0.97), rgba(15,5,26,0.99))",
            border: "1px solid rgba(124,34,212,0.35)",
            boxShadow: "0 0 60px rgba(124,34,212,0.15), 0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex justify-center mb-6">
            <MoonIcon size={90} />
          </div>

          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <AlertTriangle size={24} style={{ color: "#f87171" }} />
          </div>

          <h1
            className="font-display font-bold text-2xl mb-3"
            style={{
              background: "linear-gradient(135deg, #f3e8ff, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {errorInfo.title}
          </h1>

          <p className="text-sm mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>
            Код ошибки: <code style={{ color: "#c084fc", background: "rgba(124,34,212,0.2)", padding: "2px 8px", borderRadius: "6px", fontSize: "11px" }}>{errorKey}</code>
          </p>

          <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(167,139,250,0.65)" }}>
            {errorInfo.desc}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/login"
              className="px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                boxShadow: "0 4px 20px rgba(168,85,247,0.4)",
              }}
            >
              Попробовать снова
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300"
              style={{
                border: "1px solid rgba(124,34,212,0.4)",
                color: "#c084fc",
              }}
            >
              На главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#09030f" }}>
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
