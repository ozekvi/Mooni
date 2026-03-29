"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Gem, Zap, Swords, Users, Crown, Shield, Star, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ReactNode> = {
  leveling: <Zap size={22} />, gems: <Gem size={22} />, alliance: <Users size={22} />,
  pvp: <Swords size={22} />, defense: <Shield size={22} />, vip: <Crown size={22} />,
};

export default function ServicesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mooni-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
    fetch("/api/products").then(r => r.json()).then(d => { if (Array.isArray(d)) setProducts(d); });
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("mooni-theme", next);
  };

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  const handleBuy = async (productId: string) => {
    if (!session) { router.push("/auth/login"); return; }
    setBuyingId(productId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { setBuyingId(null); }
  };

  const isDark = theme === "dark";

  return (
    <div style={{ backgroundColor: isDark ? "#09030f" : "#f8f5ff", color: isDark ? "#f3e8ff" : "#3b0764", minHeight: "100vh" }}>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display font-bold text-5xl mb-4"
            style={{ background: isDark ? "linear-gradient(135deg,#f3e8ff,#c084fc)" : "linear-gradient(135deg,#4c1d95,#7c22d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            All Services
          </h1>
          <p className="font-body text-lg max-w-xl mx-auto" style={{ color: isDark ? "rgba(167,139,250,0.7)" : "#7c3aed" }}>
            Premium Rise of Kingdoms services · Secure payments via Stripe
          </p>
        </div>

        {/* Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all",
                  filter === cat ? "text-white" : isDark ? "border border-purple-800/60 text-purple-400 hover:border-purple-600" : "border border-purple-200 text-purple-600 hover:border-purple-400")}
                style={filter === cat ? { background: "linear-gradient(135deg,#7c22d4,#a855f7)" } : {}}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Star size={52} className="mx-auto mb-4 opacity-20" style={{ color: "#a855f7" }} />
            <p style={{ color: isDark ? "#6d28d9" : "#a78bfa" }}>No services available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div key={product.id}
                className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: isDark ? "rgba(26,10,46,0.7)" : "rgba(255,255,255,0.9)",
                  borderColor: isDark ? "rgba(59,7,100,0.5)" : "rgba(216,180,254,0.5)",
                  boxShadow: isDark ? "0 4px 30px rgba(0,0,0,0.4)" : "0 4px 20px rgba(147,51,234,0.08)",
                }}>
                <div className="flex items-start justify-between mb-5">
                  <div className="p-3 rounded-xl" style={{ background: "rgba(124,34,212,0.2)", color: "#a855f7" }}>
                    {product.category ? categoryIcons[product.category] || <Star size={22} /> : <Star size={22} />}
                  </div>
                  <span className="font-display font-bold text-2xl"
                    style={{ background: "linear-gradient(135deg,#c084fc,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {formatPrice(product.price, product.currency)}
                  </span>
                </div>

                {product.category && (
                  <span className="inline-block text-xs px-2.5 py-1 rounded-lg mb-3 capitalize"
                    style={{ background: "rgba(124,34,212,0.2)", color: "#a855f7" }}>
                    {product.category}
                  </span>
                )}

                <h3 className="font-display font-semibold text-xl mb-2" style={{ color: isDark ? "#f3e8ff" : "#3b0764" }}>
                  {product.name}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: isDark ? "rgba(167,139,250,0.6)" : "#7c3aed" }}>
                  {product.description}
                </p>

                <button onClick={() => handleBuy(product.id)} disabled={buyingId === product.id}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#7c22d4,#a855f7)", boxShadow: "0 4px 15px rgba(168,85,247,0.25)" }}>
                  {buyingId === product.id ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Redirecting...</>
                  ) : session ? (
                    <><ShoppingCart size={16} /> Purchase Now</>
                  ) : (
                    <><ShoppingCart size={16} /> Sign in to Purchase</>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
