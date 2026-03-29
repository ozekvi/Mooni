"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import MoonIcon from "@/components/ui/MoonIcon";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: (Math.random() * 0.005 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 0.9) s.speed = -Math.abs(s.speed);
        if (s.alpha < 0.1) s.speed = Math.abs(s.speed);
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,180,255,${s.alpha})`;
        ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.45) 0%, #09030f 60%)" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 900, height: 600, pointerEvents: "none", background: "radial-gradient(ellipse, rgba(124,34,212,0.2) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "96px 24px 64px" }}>
        <div style={{ marginBottom: 24, animation: "fadeInUp 0.8s ease-out forwards", opacity: 0 }}>
          <MoonIcon size={220} />
        </div>

        <div style={{ animation: "fadeInUp 0.8s ease-out 0.3s forwards", opacity: 0 }}>
          <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: "clamp(52px,10vw,84px)", letterSpacing: "0.3em", margin: "0 0 8px", background: "linear-gradient(135deg,#f3e8ff 0%,#c084fc 50%,#7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MOONI</h1>
          <p style={{ fontFamily: "var(--font-raleway), sans-serif", fontWeight: 400, fontSize: 13, letterSpacing: "0.55em", textTransform: "uppercase", margin: 0, color: "#9333ea" }}>Services</p>
        </div>

        <div style={{ margin: "28px 0", width: 140, height: 1, background: "linear-gradient(90deg,transparent,#a855f7,transparent)", animation: "fadeIn 1s ease-out 0.55s forwards", opacity: 0 }} />

        <div style={{ animation: "fadeInUp 0.8s ease-out 0.5s forwards", opacity: 0 }}>
          <p style={{ fontFamily: "var(--font-raleway), sans-serif", fontSize: "clamp(16px,3vw,20px)", maxWidth: 520, lineHeight: 1.65, marginBottom: 10, color: "#e9d5ff" }}>
            Dominate the Kingdom with <span style={{ color: "#a855f7", fontWeight: 600 }}>premium services</span>
          </p>
          <p style={{ fontSize: "clamp(13px,2vw,15px)", color: "rgba(167,139,250,0.65)", maxWidth: 400, margin: "0 auto" }}>
            Power leveling · Gem farming · Alliance support · Custom orders
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 40, justifyContent: "center", animation: "fadeInUp 0.8s ease-out 0.7s forwards", opacity: 0 }}>
          <Link href="/services" style={{ padding: "15px 34px", borderRadius: 16, textDecoration: "none", background: "linear-gradient(135deg,#6b21a8,#a855f7)", boxShadow: "0 0 28px rgba(168,85,247,0.5)", color: "white", fontSize: 15, fontWeight: 600, letterSpacing: "0.04em" }}>
            Explore Services
          </Link>
          <Link href="/auth/signup" style={{ padding: "15px 34px", borderRadius: 16, textDecoration: "none", border: "1px solid rgba(124,34,212,0.55)", color: "#c084fc", fontSize: 15, fontWeight: 500 }}>
            Get Started Free
          </Link>
        </div>

        <div style={{ animation: "fadeIn 1s ease-out 1s forwards", opacity: 0, marginTop: 44 }}>
          <Link href="/auth/signup" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 14, textDecoration: "none", border: "1px solid rgba(88,101,242,0.35)", background: "rgba(88,101,242,0.08)", color: "#a5b4fc", fontSize: 14 }}>
            <svg width="19" height="19" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Sign in with Discord to join our server
          </Link>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(88,28,135,0.7)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", animation: "fadeIn 1s 1.5s forwards", opacity: 0 }}>
        <span>Scroll</span>
        <div style={{ width: 1, height: 30, background: "linear-gradient(to bottom,#7c3aed,transparent)", animation: "moonFloat 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}
