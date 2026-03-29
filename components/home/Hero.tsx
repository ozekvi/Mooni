"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import MoonIcon from "@/components/ui/MoonIcon";
import { cn } from "@/lib/utils";

interface HeroProps {
  theme: "dark" | "light";
}

export default function Hero({ theme }: HeroProps) {
  const starsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (theme !== "dark") return;
    const canvas = starsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.002,
    }));

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,181,253,${s.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [theme]);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          theme === "dark"
            ? "radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.4) 0%, rgba(9,3,15,1) 60%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(233,213,255,0.8) 0%, rgba(248,245,255,1) 60%)",
      }}
    >
      {/* Star canvas */}
      {theme === "dark" && (
        <canvas ref={starsRef} className="absolute inset-0 pointer-events-none" />
      )}

      {/* Radial bg glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(ellipse, rgba(124,34,212,0.25) 0%, transparent 70%)"
              : "radial-gradient(ellipse, rgba(192,132,252,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-16">
        {/* Animated Moon */}
        <div
          className="mb-6"
          style={{ animation: "fadeInUp 0.8s ease-out forwards", opacity: 0 }}
        >
          <MoonIcon size={240} />
        </div>

        {/* Title */}
        <div style={{ animation: "fadeInUp 0.8s ease-out 0.3s forwards", opacity: 0 }}>
          <h1
            className="font-display font-bold tracking-[0.3em] text-5xl md:text-7xl mb-2"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #f3e8ff 0%, #c084fc 50%, #7c3aed 100%)"
                  : "linear-gradient(135deg, #6b21a8 0%, #9333ea 50%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MOONI
          </h1>
          <p
            className={cn(
              "font-body font-medium text-sm md:text-base tracking-[0.5em] uppercase",
              theme === "dark" ? "text-purple-400" : "text-purple-600"
            )}
          >
            Services
          </p>
        </div>

        {/* Divider */}
        <div
          className="my-8 w-48 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #a855f7, transparent)",
            animation: "fadeIn 1s ease-out 0.6s forwards",
            opacity: 0,
          }}
        />

        {/* Tagline */}
        <div style={{ animation: "fadeInUp 0.8s ease-out 0.5s forwards", opacity: 0 }}>
          <p
            className={cn(
              "font-body text-lg md:text-xl max-w-xl leading-relaxed mb-2",
              theme === "dark" ? "text-purple-200" : "text-purple-800"
            )}
          >
            Dominate the Kingdom with{" "}
            <span className="text-purple-400 font-semibold">premium services</span>
          </p>
          <p
            className={cn(
              "font-body text-sm md:text-base max-w-md",
              theme === "dark" ? "text-purple-400/70" : "text-purple-500"
            )}
          >
            Power leveling · Gem farming · Alliance support · Custom orders
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-10"
          style={{ animation: "fadeInUp 0.8s ease-out 0.7s forwards", opacity: 0 }}
        >
          <Link
            href="/services"
            className="relative group px-8 py-4 rounded-2xl font-body font-semibold text-white overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #7c22d4, #a855f7, #c084fc)",
              boxShadow: "0 0 30px rgba(168,85,247,0.5), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <span className="relative z-10 tracking-wide">Explore Services</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="/auth/signup"
            className={cn(
              "px-8 py-4 rounded-2xl font-body font-semibold transition-all duration-300",
              theme === "dark"
                ? "border border-purple-700 text-purple-300 hover:border-purple-500 hover:text-purple-100 hover:bg-purple-900/20"
                : "border border-purple-300 text-purple-700 hover:border-purple-500 hover:bg-purple-50"
            )}
          >
            Get Started Free
          </Link>
        </div>

        {/* Discord badge */}
        <div
          style={{ animation: "fadeIn 1s ease-out 1s forwards", opacity: 0 }}
          className="mt-12"
        >
          <Link
            href="/auth/signup"
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-body transition-all duration-300",
              theme === "dark"
                ? "border-indigo-800/50 bg-indigo-950/30 text-indigo-300 hover:border-indigo-600 hover:bg-indigo-950/50"
                : "border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:border-indigo-400"
            )}
          >
            <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
            Sign in with Discord to join our server
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ animation: "fadeIn 1s ease-out 1.5s forwards", opacity: 0 }}
      >
        <div
          className={cn(
            "flex flex-col items-center gap-2 text-xs tracking-widest uppercase",
            theme === "dark" ? "text-purple-600" : "text-purple-400"
          )}
        >
          <span>Scroll</span>
          <div
            className="w-px h-8"
            style={{
              background: "linear-gradient(to bottom, #7c3aed, transparent)",
              animation: "moonFloat 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
