"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";

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

  const isDark = theme === "dark";

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: isDark ? "#09030f" : "#faf7ff",
      color: isDark ? "#f3e8ff" : "#1e0038",
      transition: "background-color 0.4s ease, color 0.4s ease",
    }}>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Hero theme={theme} />
      <ServicesSection theme={theme} />

      {/* Footer */}
      <footer style={{
        padding: "48px 24px",
        textAlign: "center",
        borderTop: `1px solid ${isDark ? "rgba(59,7,100,0.3)" : "rgba(167,139,250,0.2)"}`,
        background: isDark ? "#09030f" : "#faf7ff",
      }}>
        <div style={{
          fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 18,
          letterSpacing: "0.3em", marginBottom: 8,
          background: "linear-gradient(135deg, #c084fc, #7c3aed)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>MOONI</div>
        <p style={{ color: isDark ? "rgba(107,33,168,0.7)" : "rgba(107,33,168,0.6)", fontSize: 13, margin: "0 0 16px" }}>
          © {new Date().getFullYear()} Mooni Services · Rise of Kingdoms
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
          {["Privacy", "Terms", "Discord"].map(l => (
            <a key={l} href="#" style={{
              fontSize: 12, textDecoration: "none",
              color: isDark ? "rgba(107,33,168,0.6)" : "rgba(107,33,168,0.5)",
            }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
