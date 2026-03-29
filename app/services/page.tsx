"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Gem, Zap, Swords, Users, Crown, Shield, Star } from "lucide-react";

const icons: Record<string, React.ReactNode> = {
  leveling: <Zap size={22}/>, gems: <Gem size={22}/>, alliance: <Users size={22}/>,
  pvp: <Swords size={22}/>, defense: <Shield size={22}/>, vip: <Crown size={22}/>,
};

export default function ServicesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setProducts(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]];
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  const handleBuy = async (productId: string) => {
    if (!session) { router.push("/auth/login"); return; }
    setBuyingId(productId);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setBuyingId(null);
    } catch { setBuyingId(null); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09030f", color: "#f3e8ff", fontFamily: "var(--font-raleway), sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "110px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: "clamp(36px,7vw,54px)", background: "linear-gradient(135deg,#f3e8ff,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 14 }}>All Services</h1>
          <p style={{ fontSize: 16, color: "rgba(167,139,250,0.65)", maxWidth: 460, margin: "0 auto" }}>Premium Rise of Kingdoms services · Secure payments via Stripe</p>
        </div>

        {/* Filter pills */}
        {categories.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 44 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                style={{ padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer", textTransform: "capitalize", border: "none", transition: "all 0.2s",
                  background: filter === cat ? "linear-gradient(135deg,#7c22d4,#a855f7)" : "rgba(88,28,135,0.15)",
                  boxShadow: filter === cat ? "0 4px 16px rgba(168,85,247,0.3)" : "none",
                  color: filter === cat ? "white" : "rgba(167,139,250,0.7)",
                  borderColor: filter === cat ? "transparent" : "rgba(88,28,135,0.3)",
                }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: 40, height: 40, border: "3px solid rgba(124,34,212,0.3)", borderTopColor: "#a855f7", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Star size={52} style={{ color: "rgba(107,33,168,0.4)", marginBottom: 16 }} />
            <p style={{ color: "rgba(107,33,168,0.6)" }}>No services available yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
            {filtered.map(product => (
              <div key={product.id} style={{ borderRadius: 20, border: "1px solid rgba(59,7,100,0.4)", padding: "26px", background: "rgba(18,6,36,0.7)", transition: "all 0.3s", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ padding: 10, borderRadius: 12, background: "rgba(124,34,212,0.18)", color: "#a855f7" }}>
                    {product.category ? icons[product.category] || <Star size={22} /> : <Star size={22} />}
                  </div>
                  <span style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: 22, background: "linear-gradient(135deg,#c084fc,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {formatPrice(product.price, product.currency)}
                  </span>
                </div>
                {product.category && (
                  <span style={{ display: "inline-block", fontSize: 11, padding: "4px 12px", borderRadius: 999, background: "rgba(124,34,212,0.18)", color: "#a855f7", textTransform: "capitalize", marginBottom: 12, alignSelf: "flex-start" }}>
                    {product.category}
                  </span>
                )}
                <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 600, fontSize: 18, color: "#f3e8ff", marginBottom: 10 }}>{product.name}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(167,139,250,0.6)", flex: 1, marginBottom: 22 }}>{product.description}</p>
                <button onClick={() => handleBuy(product.id)} disabled={!!buyingId}
                  style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", cursor: buyingId ? "not-allowed" : "pointer", background: "linear-gradient(135deg,#6b21a8,#a855f7)", boxShadow: "0 4px 16px rgba(168,85,247,0.3)", color: "white", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: buyingId ? 0.7 : 1 }}>
                  {buyingId === product.id ? <><span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite", display: "inline-block" }} /> Processing…</> : <><ShoppingCart size={16} /> {session ? "Purchase Now" : "Sign in to Buy"}</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
