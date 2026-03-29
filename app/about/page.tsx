"use client";
import Link from "next/link";
import MoonIcon from "@/components/ui/MoonIcon";
import { Shield, Zap, Users, Star, ChevronRight, MessageCircle } from "lucide-react";

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "3+", label: "Years Experience" },
  { value: "99%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support" },
];

const features = [
  { icon: <Zap size={22} />, title: "Fast Delivery", desc: "We start your order within hours, not days. Our team is always ready to power up your account." },
  { icon: <Shield size={22} />, title: "100% Safe", desc: "All our methods are safe and tested. We never use bots or exploits that could risk your account." },
  { icon: <Users size={22} />, title: "Expert Team", desc: "Our players have thousands of hours in Rise of Kingdoms. Real veterans, real results." },
  { icon: <Star size={22} />, title: "Custom Orders", desc: "Have a specific goal? We handle custom requests of any size. Just ask us on Discord." },
];

const card = {
  background: "rgba(20,8,40,0.7)",
  border: "1px solid rgba(124,34,212,0.25)",
  borderRadius: 20,
  backdropFilter: "blur(12px)",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#09030f", color: "#f3e8ff", fontFamily: "var(--font-raleway), sans-serif" }}>
      {/* Nav back */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(9,3,15,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(59,7,100,0.3)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <MoonIcon size={32} />
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.3em", background: "linear-gradient(135deg,#c084fc,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MOONI</span>
        </Link>
        <Link href="/auth/signup" style={{ padding: "9px 20px", borderRadius: 12, background: "linear-gradient(135deg,#7c22d4,#a855f7)", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Get Started</Link>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 24px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <MoonIcon size={160} />
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: "clamp(36px,7vw,56px)", letterSpacing: "0.15em", margin: "0 0 16px", background: "linear-gradient(135deg,#f3e8ff 0%,#c084fc 50%,#7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            About Mooni
          </h1>
          <p style={{ fontSize: 18, color: "rgba(167,139,250,0.8)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            We are a team of passionate Rise of Kingdoms veterans dedicated to helping players reach their full potential — faster, safer, and smarter.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 64 }}>
          {stats.map(s => (
            <div key={s.label} style={{ ...card, padding: "28px 20px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: 36, background: "linear-gradient(135deg,#c084fc,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "rgba(167,139,250,0.6)", letterSpacing: "0.1em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div style={{ ...card, padding: "40px", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 600, fontSize: 22, color: "#e9d5ff", marginBottom: 16 }}>Our Story</h2>
          <p style={{ color: "rgba(167,139,250,0.75)", lineHeight: 1.8, fontSize: 15, marginBottom: 14 }}>
            Mooni started as a small group of top-tier RoK players who wanted to share their expertise. After years of competing in KvK, leading alliances, and hitting the highest power milestones — we realized that most players are held back not by skill, but by time.
          </p>
          <p style={{ color: "rgba(167,139,250,0.75)", lineHeight: 1.8, fontSize: 15 }}>
            That's why we built Mooni. A professional service where you can trust your account to experts who have done it themselves — and get results without sacrificing your real life.
          </p>
        </div>

        {/* Features grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 64 }}>
          {features.map(f => (
            <div key={f.title} style={{ ...card, padding: "28px 24px" }}>
              <div style={{ color: "#a855f7", marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: 16, fontWeight: 600, color: "#e9d5ff", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(167,139,250,0.65)", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", ...card, padding: "52px 40px" }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: 28, background: "linear-gradient(135deg,#f3e8ff,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 16 }}>
            Ready to dominate?
          </h2>
          <p style={{ color: "rgba(167,139,250,0.7)", fontSize: 15, marginBottom: 32 }}>
            Join hundreds of players who've already leveled up with Mooni Services.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, background: "linear-gradient(135deg,#7c22d4,#a855f7)", boxShadow: "0 0 24px rgba(168,85,247,0.4)", color: "white", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              View Services <ChevronRight size={16} />
            </Link>
            <Link href="/auth/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, border: "1px solid rgba(124,34,212,0.5)", color: "#c084fc", fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
              <MessageCircle size={16} /> Join Discord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
