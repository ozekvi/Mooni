"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Star, Zap, Shield, Swords, Gem, Users, Crown } from "lucide-react";

interface Product { id: string; name: string; description: string; price: number; currency: string; category?: string; }

const icons: Record<string, React.ReactNode> = {
  leveling: <Zap size={20}/>, gems: <Gem size={20}/>, alliance: <Users size={20}/>,
  pvp: <Swords size={20}/>, defense: <Shield size={20}/>, vip: <Crown size={20}/>,
};

const defaults: Product[] = [
  { id: "1", name: "Power Leveling", description: "Rapidly boost your commander levels with our expert farming teams. Reach your target power in record time.", price: 29.99, currency: "usd", category: "leveling" },
  { id: "2", name: "Gem Farming", description: "Maximize your gem income with daily farming strategies and optimized resource gathering routes.", price: 19.99, currency: "usd", category: "gems" },
  { id: "3", name: "Alliance Boost", description: "Full alliance support including territory control, rally coordination, and leadership guidance.", price: 49.99, currency: "usd", category: "alliance" },
  { id: "4", name: "KvK Strategy", description: "Elite Kingdom vs Kingdom preparation and execution strategies from veteran players.", price: 39.99, currency: "usd", category: "pvp" },
  { id: "5", name: "Troop Training", description: "Optimize your troop composition and training queue for maximum combat effectiveness.", price: 24.99, currency: "usd", category: "defense" },
  { id: "6", name: "VIP Management", description: "Full account management service with daily tasks, events, and resource optimization.", price: 89.99, currency: "usd", category: "vip" },
];

export default function ServicesSection() {
  const [products, setProducts] = useState<Product[]>(defaults);

  useEffect(() => {
    fetch("/api/products").then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setProducts(d); })
      .catch(() => {});
  }, []);

  return (
    <section style={{ position: "relative", padding: "110px 24px", background: "linear-gradient(180deg,#09030f 0%,#0e0419 50%,#09030f 100%)" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 50%,rgba(88,28,135,0.07) 0%,transparent 70%)" }} />

      <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", padding: "6px 18px", borderRadius: 999, border: "1px solid rgba(124,34,212,0.35)", background: "rgba(88,28,135,0.12)", color: "#a78bfa", marginBottom: 20 }}>
            <Star size={11} /> Our Services
          </div>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: "clamp(30px,5vw,46px)", background: "linear-gradient(135deg,#f3e8ff 0%,#c084fc 60%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 14px" }}>
            Rise to Power
          </h2>
          <p style={{ fontSize: 16, color: "rgba(167,139,250,0.65)", maxWidth: 440, margin: "0 auto" }}>
            Professional Rise of Kingdoms services tailored to your goals
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 22 }}>
          {products.map(p => <Card key={p.id} product={p} />)}
        </div>

        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Link href="/services" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(124,34,212,0.4)", color: "#c084fc", fontSize: 14, textDecoration: "none" }}>
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Card({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 20, border: `1px solid ${hovered ? "rgba(168,85,247,0.5)" : "rgba(59,7,100,0.4)"}`, padding: "24px", background: hovered ? "rgba(30,10,55,0.85)" : "rgba(18,6,36,0.7)", boxShadow: hovered ? "0 8px 40px rgba(88,28,135,0.2)" : "0 4px 20px rgba(0,0,0,0.3)", transform: hovered ? "translateY(-4px)" : "none", transition: "all 0.3s ease", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ padding: "10px", borderRadius: 12, background: "rgba(124,34,212,0.18)", color: "#a855f7" }}>
          {product.category ? icons[product.category] || <Star size={20} /> : <Star size={20} />}
        </div>
        <span style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: 20, background: "linear-gradient(135deg,#c084fc,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {formatPrice(product.price, product.currency)}
        </span>
      </div>
      <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 600, fontSize: 17, color: "#f3e8ff", marginBottom: 10 }}>{product.name}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(167,139,250,0.6)", flex: 1, marginBottom: 22 }}>{product.description}</p>
      <Link href="/auth/signup" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 12, background: "linear-gradient(135deg,#6b21a8,#a855f7)", boxShadow: "0 4px 16px rgba(168,85,247,0.3)", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
        <ShoppingCart size={15} /> Order Now
      </Link>
    </div>
  );
}
