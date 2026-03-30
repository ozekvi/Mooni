"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import MoonImage from "@/components/ui/MoonImage";

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
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.8 + 0.2,
      a: Math.random() * 0.8 + 0.1,
      spd: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a += s.spd;
        if (s.a > 0.9) s.spd = -Math.abs(s.spd);
        if (s.a < 0.05) s.spd = Math.abs(s.spd);
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,190,255,${s.a})`;
        ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "radial-gradient(ellipse at 50% -10%, rgba(100,20,200,0.5) 0%, #07020f 65%)" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Animated orbs */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(88,28,135,0.12) 0%, transparent 70%)", top: "10%", left: "50%", transform: "translateX(-50%)", animation: "orb 18s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,34,212,0.1) 0%, transparent 70%)", bottom: "20%", right: "10%", animation: "orb 24s ease-in-out infinite reverse", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "100px 24px 60px", width: "100%" }}>

        {/* Moon PNG */}
        <div style={{ animation: "fadeInUp 1s ease-out forwards", opacity: 0, marginBottom: 32 }}>
          <MoonImage size={220} />
        </div>

        {/* Brand */}
        <div style={{ animation: "fadeInUp 0.9s ease-out 0.25s forwards", opacity: 0 }}>
          <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 900, fontSize: "clamp(56px, 12vw, 92px)", letterSpacing: "0.25em", lineHeight: 1, margin: "0 0 10px", background: "linear-gradient(160deg, #ffffff 0%, #e9d5ff 25%, #c084fc 55%, #9333ea 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            MOONI
          </h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ height: 1, width: 40, background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6))" }} />
            <p style={{ fontFamily: "var(--font-space), sans-serif", fontWeight: 500, fontSize: 12, letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(192,132,252,0.7)" }}>Services</p>
            <div style={{ height: 1, width: 40, background: "linear-gradient(90deg, rgba(168,85,247,0.6), transparent)" }} />
          </div>
        </div>

        {/* Tagline */}
        <div style={{ animation: "fadeInUp 0.9s ease-out 0.45s forwards", opacity: 0, marginTop: 32, maxWidth: 580 }}>
          <p style={{ fontFamily: "var(--font-plus), sans-serif", fontSize: "clamp(17px, 3vw, 22px)", fontWeight: 300, lineHeight: 1.65, color: "rgba(233,213,255,0.85)", marginBottom: 12 }}>
            Dominate the Kingdom with{" "}
            <span style={{ fontWeight: 700, color: "#c084fc" }}>elite services</span>
          </p>
          <p style={{ fontFamily: "var(--font-space), sans-serif", fontSize: 13, color: "rgba(167,139,250,0.5)", letterSpacing: "0.1em" }}>
           Fog exploring · Gem farming
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 44, justifyContent: "center", animation: "fadeInUp 0.9s ease-out 0.65s forwards", opacity: 0 }}>
          <Link href="/services" style={{ position: "relative", padding: "15px 36px", borderRadius: 100, textDecoration: "none", background: "linear-gradient(135deg, #5b21b6, #9333ea, #c084fc)", boxShadow: "0 0 40px rgba(147,51,234,0.5), 0 4px 24px rgba(0,0,0,0.4)", color: "white", fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", fontFamily: "var(--font-space), sans-serif", overflow: "hidden" }}>
            <span style={{ position: "relative", zIndex: 1 }}>Explore Services</span>
          </Link>
          <Link href="/auth/signup" style={{ padding: "15px 36px", borderRadius: 100, textDecoration: "none", background: "rgba(88,28,135,0.15)", border: "1px solid rgba(168,85,247,0.35)", color: "rgba(216,180,254,0.9)", fontSize: 15, fontWeight: 600, fontFamily: "var(--font-space), sans-serif", backdropFilter: "blur(8px)" }}>
            Get Started Free
          </Link>
        </div>

        {/* Discord badge */}
        <div style={{ marginTop: 52, animation: "fadeIn 1s ease-out 1s forwards", opacity: 0 }}>
          <Link href="/auth/signup" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "11px 22px", borderRadius: 100, textDecoration: "none", background: "rgba(88,101,242,0.1)", border: "1px solid rgba(88,101,242,0.3)", color: "rgba(165,180,252,0.85)", fontSize: 13, fontFamily: "var(--font-space), sans-serif", backdropFilter: "blur(8px)", transition: "all 0.25s" }}>
            <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Connect your Discord & join our server
          </Link>
        </div>

        {/* Scroll */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0, animation: "fadeIn 1s 1.5s forwards" }}>
          <span style={{ fontSize: 10, letterSpacing: "0.4em", color: "rgba(107,33,168,0.6)", textTransform: "uppercase", fontFamily: "var(--font-space), sans-serif" }}>scroll</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(124,34,212,0.8), transparent)", animation: "moonFloat 2.5s ease-in-out infinite" }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          section { min-height: 100svh !important; }
        }
      `}</style>
    </section>
  );
}
