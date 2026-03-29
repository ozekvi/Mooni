"use client";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09030f", color: "#f3e8ff" }}>
      <Navbar />
      <Hero />
      <ServicesSection />

      {/* Footer */}
      <footer style={{ padding: "48px 24px", textAlign: "center", borderTop: "1px solid rgba(59,7,100,0.3)", background: "#09030f" }}>
        <div style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: 18, letterSpacing: "0.3em", marginBottom: 8, background: "linear-gradient(135deg,#c084fc,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MOONI</div>
        <p style={{ color: "rgba(107,33,168,0.6)", fontSize: 13, margin: "0 0 16px" }}>© {new Date().getFullYear()} Mooni Services · Rise of Kingdoms</p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
          {[["Privacy", "#"], ["Terms", "#"], ["About", "/about"], ["Discord", "#"]].map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: 12, textDecoration: "none", color: "rgba(107,33,168,0.55)", transition: "color 0.2s" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
