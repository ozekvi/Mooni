"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import MoonIcon from "@/components/ui/MoonIcon";

interface HeroProps {
  theme: "dark" | "light";
}

export default function Hero({ theme }: HeroProps) {
  const starsRef = useRef<HTMLCanvasElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    if (!isDark) return;
    const canvas = starsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3, alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.002,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,181,253,${s.alpha})`;
        ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [isDark]);

  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      background: isDark
        ? "radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.4) 0%, #09030f 60%)"
        : "radial-gradient(ellipse at 50% 0%, rgba(233,213,255,0.8) 0%, #f8f5ff 60%)",
    }}>
      {/* Star canvas */}
      {isDark && <canvas ref={starsRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />}

      {/* Radial glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 600, pointerEvents: "none",
        background: isDark
          ? "radial-gradient(ellipse, rgba(124,34,212,0.25) 0%, transparent 70%)"
          : "radial-gradient(ellipse, rgba(192,132,252,0.3) 0%, transparent 70%)",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 10, display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center", padding: "96px 24px 64px",
      }}>
        {/* Moon */}
        <div style={{ marginBottom: 24, animation: "fadeInUp 0.8s ease-out forwards", opacity: 0 }}>
          <MoonIcon size={240} />
        </div>

        {/* Title */}
        <div style={{ animation: "fadeInUp 0.8s ease-out 0.3s forwards", opacity: 0 }}>
          <h1 style={{
            fontFamily: "var(--font-cinzel), serif",
            fontWeight: 700, fontSize: "clamp(48px, 10vw, 80px)",
            letterSpacing: "0.3em", margin: "0 0 8px",
            background: isDark
              ? "linear-gradient(135deg, #f3e8ff 0%, #c084fc 50%, #7c3aed 100%)"
              : "linear-gradient(135deg, #6b21a8 0%, #9333ea 50%, #a855f7 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>MOONI</h1>
          <p style={{
            fontFamily: "var(--font-raleway), sans-serif",
            fontWeight: 500, fontSize: 13, letterSpacing: "0.5em",
            textTransform: "uppercase", margin: 0,
            color: isDark ? "#a855f7" : "#7c3aed",
          }}>Services</p>
        </div>

        {/* Divider */}
        <div style={{
          margin: "32px 0", width: 160, height: 1,
          background: "linear-gradient(90deg, transparent, #a855f7, transparent)",
          animation: "fadeIn 1s ease-out 0.6s forwards", opacity: 0,
        }} />

        {/* Tagline */}
        <div style={{ animation: "fadeInUp 0.8s ease-out 0.5s forwards", opacity: 0 }}>
          <p style={{
            fontFamily: "var(--font-raleway), sans-serif",
            fontSize: "clamp(16px, 3vw, 20px)", maxWidth: 520, lineHeight: 1.6,
            marginBottom: 8, color: isDark ? "#e9d5ff" : "#581c87",
          }}>
            Dominate the Kingdom with{" "}
            <span style={{ color: "#a855f7", fontWeight: 600 }}>premium services</span>
          </p>
          <p style={{
            fontSize: "clamp(13px, 2vw, 15px)", maxWidth: 420, margin: "0 auto",
            color: isDark ? "rgba(167,139,250,0.7)" : "#7c3aed",
          }}>
            Power leveling · Gem farming · Alliance support · Custom orders
          </p>
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 16, marginTop: 40, justifyContent: "center",
          animation: "fadeInUp 0.8s ease-out 0.7s forwards", opacity: 0,
        }}>
          <Link href="/services" style={{
            padding: "16px 32px", borderRadius: 16, textDecoration: "none",
            background: "linear-gradient(135deg, #7c22d4, #a855f7, #c084fc)",
            boxShadow: "0 0 30px rgba(168,85,247,0.5), 0 4px 20px rgba(0,0,0,0.3)",
            color: "white", fontSize: 15, fontWeight: 600, letterSpacing: "0.05em",
          }}>
            Explore Services
          </Link>
          <Link href="/auth/signup" style={{
            padding: "16px 32px", borderRadius: 16, textDecoration: "none",
            border: `1px solid ${isDark ? "rgba(124,34,212,0.6)" : "rgba(167,139,250,0.6)"}`,
            color: isDark ? "#c084fc" : "#7c22d4",
            fontSize: 15, fontWeight: 600,
          }}>
            Get Started Free
          </Link>
        </div>

        {/* Discord badge */}
        <div style={{ animation: "fadeIn 1s ease-out 1s forwards", opacity: 0, marginTop: 48 }}>
          <Link href="/auth/signup" style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "12px 20px", borderRadius: 14, textDecoration: "none",
            border: `1px solid ${isDark ? "rgba(88,101,242,0.4)" : "rgba(99,102,241,0.3)"}`,
            background: isDark ? "rgba(88,101,242,0.1)" : "rgba(238,242,255,0.7)",
            color: isDark ? "#a5b4fc" : "#4f46e5", fontSize: 14,
          }}>
            <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
            Sign in with Discord to join our server
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        animation: "fadeIn 1s ease-out 1.5s forwards", opacity: 0,
        color: isDark ? "#4c1d95" : "#a78bfa", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
      }}>
        <span>Scroll</span>
        <div style={{
          width: 1, height: 32,
          background: "linear-gradient(to bottom, #7c3aed, transparent)",
          animation: "moonFloat 2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}
