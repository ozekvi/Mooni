"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("mooni-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("mooni-theme", next);
  };

  return (
    <div style={{ backgroundColor: theme === "dark" ? "#09030f" : "#f8f5ff", color: theme === "dark" ? "#f3e8ff" : "#3b0764", minHeight: "100vh" }}>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Hero theme={theme} />
      <ServicesSection theme={theme} />
      <footer className="py-12 px-6 text-center border-t" style={{ borderColor: theme === "dark" ? "rgba(59,7,100,0.3)" : "rgba(216,180,254,0.4)" }}>
        <div className="font-display font-bold text-lg tracking-widest mb-2" style={{ background: "linear-gradient(135deg,#c084fc,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MOONI</div>
        <p className={cn("font-body text-sm", theme === "dark" ? "text-purple-600" : "text-purple-400")}>© {new Date().getFullYear()} Mooni Services · Rise of Kingdoms</p>
      </footer>
    </div>
  );
}
