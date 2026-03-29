"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { ShoppingCart, Star, Zap, Shield, Swords, Gem, Users, Crown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category?: string;
  image?: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  leveling: <Zap size={20} />,
  gems: <Gem size={20} />,
  alliance: <Users size={20} />,
  pvp: <Swords size={20} />,
  defense: <Shield size={20} />,
  vip: <Crown size={20} />,
};

const defaultServices: Product[] = [
  { id: "1", name: "Power Leveling", description: "Rapidly boost your commander levels with our expert farming teams. Reach your target power in record time.", price: 29.99, currency: "usd", category: "leveling" },
  { id: "2", name: "Gem Farming", description: "Maximize your gem income with daily farming strategies and optimized resource gathering routes.", price: 19.99, currency: "usd", category: "gems" },
  { id: "3", name: "Alliance Boost", description: "Full alliance support including territory control, rally coordination, and leadership guidance.", price: 49.99, currency: "usd", category: "alliance" },
  { id: "4", name: "KvK Strategy", description: "Elite Kingdom vs Kingdom preparation and execution strategies from veteran players.", price: 39.99, currency: "usd", category: "pvp" },
  { id: "5", name: "Troop Training", description: "Optimize your troop composition and training queue for maximum combat effectiveness.", price: 24.99, currency: "usd", category: "defense" },
  { id: "6", name: "VIP Account Management", description: "Full account management service with daily tasks, events, and resource optimization.", price: 89.99, currency: "usd", category: "vip" },
];

export default function ServicesSection({ theme }: { theme: "dark" | "light" }) {
  const [products, setProducts] = useState<Product[]>(defaultServices);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setProducts(data); })
      .catch(() => {});
  }, []);

  const isDark = theme === "dark";

  return (
    <section
      id="services"
      style={{
        position: "relative",
        padding: "120px 24px",
        background: isDark
          ? "linear-gradient(180deg, #09030f 0%, #0f051a 50%, #09030f 100%)"
          : "linear-gradient(180deg, #faf7ff 0%, #f3f0ff 50%, #faf7ff 100%)",
      }}
    >
      {/* bg glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 50%, rgba(124,34,212,0.08) 0%, transparent 70%)",
      }} />

      <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase",
            padding: "6px 16px", borderRadius: 999,
            border: `1px solid ${isDark ? "rgba(124,34,212,0.4)" : "rgba(167,139,250,0.4)"}`,
            background: isDark ? "rgba(88,28,135,0.15)" : "rgba(233,213,255,0.4)",
            color: isDark ? "#a78bfa" : "#7c3aed",
            marginBottom: 20,
          }}>
            <Star size={11} /> Our Services
          </div>

          <h2 style={{
            fontFamily: "var(--font-cinzel), serif",
            fontWeight: 700, fontSize: "clamp(32px, 5vw, 48px)",
            background: isDark
              ? "linear-gradient(135deg, #f3e8ff 0%, #c084fc 60%)"
              : "linear-gradient(135deg, #4c1d95 0%, #7c22d4 60%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            margin: "0 0 16px",
          }}>
            Rise to Power
          </h2>
          <p style={{ fontSize: 18, color: isDark ? "rgba(167,139,250,0.7)" : "#7c3aed", maxWidth: 480, margin: "0 auto" }}>
            Professional Rise of Kingdoms services tailored to your goals
          </p>
        </div>

        {/* Grid — inline CSS so it always works */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}>
          {products.map((product) => (
            <ServiceCard key={product.id} product={product} isDark={isDark} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <Link href="/services" style={{
            display: "inline-block",
            padding: "12px 28px", borderRadius: 12,
            border: `1px solid ${isDark ? "rgba(124,34,212,0.5)" : "rgba(167,139,250,0.5)"}`,
            color: isDark ? "#c084fc" : "#7c22d4",
            fontSize: 14, fontWeight: 500,
            textDecoration: "none",
            transition: "all 0.2s",
          }}>
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ product, isDark }: { product: Product; isDark: boolean }) {
  const icon = product.category ? categoryIcons[product.category] : <Star size={20} />;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        border: `1px solid ${hovered
          ? "rgba(124,34,212,0.6)"
          : isDark ? "rgba(59,7,100,0.5)" : "rgba(216,180,254,0.5)"}`,
        padding: 24,
        background: isDark
          ? "linear-gradient(135deg, rgba(26,10,46,0.85), rgba(15,5,26,0.7))"
          : "rgba(255,255,255,0.95)",
        boxShadow: hovered
          ? "0 8px 40px rgba(124,34,212,0.2)"
          : isDark ? "0 4px 30px rgba(0,0,0,0.4)" : "0 4px 20px rgba(147,51,234,0.08)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s ease",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          padding: 10, borderRadius: 12,
          background: "rgba(124,34,212,0.2)",
          color: "#a855f7",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
        <span style={{
          fontFamily: "var(--font-cinzel), serif",
          fontWeight: 700, fontSize: 20,
          background: "linear-gradient(135deg, #c084fc, #a855f7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          {formatPrice(product.price, product.currency)}
        </span>
      </div>

      {/* Name */}
      <h3 style={{
        fontFamily: "var(--font-cinzel), serif",
        fontWeight: 600, fontSize: 17, marginBottom: 10,
        color: isDark ? "#f3e8ff" : "#3b0764",
      }}>
        {product.name}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 14, lineHeight: 1.6, marginBottom: 24,
        color: isDark ? "rgba(167,139,250,0.65)" : "#7c3aed",
        flex: 1,
      }}>
        {product.description}
      </p>

      {/* Button */}
      <Link
        href="/auth/signup"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "12px 0", borderRadius: 12,
          background: "linear-gradient(135deg, #7c22d4, #a855f7)",
          boxShadow: "0 4px 15px rgba(168,85,247,0.3)",
          color: "white", fontSize: 14, fontWeight: 600,
          textDecoration: "none",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <ShoppingCart size={15} /> Order Now
      </Link>
    </div>
  );
}
