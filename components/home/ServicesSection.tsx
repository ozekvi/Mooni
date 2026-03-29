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

const defaultServices = [
  {
    id: "1",
    name: "Power Leveling",
    description: "Rapidly boost your commander levels with our expert farming teams. Reach your target power in record time.",
    price: 29.99,
    currency: "usd",
    category: "leveling",
  },
  {
    id: "2",
    name: "Gem Farming",
    description: "Maximize your gem income with daily farming strategies and optimized resource gathering routes.",
    price: 19.99,
    currency: "usd",
    category: "gems",
  },
  {
    id: "3",
    name: "Alliance Boost",
    description: "Full alliance support including territory control, rally coordination, and leadership guidance.",
    price: 49.99,
    currency: "usd",
    category: "alliance",
  },
  {
    id: "4",
    name: "KvK Strategy",
    description: "Elite Kingdom vs Kingdom preparation and execution strategies from veteran players.",
    price: 39.99,
    currency: "usd",
    category: "pvp",
  },
  {
    id: "5",
    name: "Troop Training",
    description: "Optimize your troop composition and training queue for maximum combat effectiveness.",
    price: 24.99,
    currency: "usd",
    category: "defense",
  },
  {
    id: "6",
    name: "VIP Account Management",
    description: "Full account management service with daily tasks, events, and resource optimization.",
    price: 89.99,
    currency: "usd",
    category: "vip",
  },
];

export default function ServicesSection({ theme }: { theme: "dark" | "light" }) {
  const [products, setProducts] = useState<Product[]>(defaultServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="services"
      className="relative py-32 px-6"
      style={{
        background:
          theme === "dark"
            ? "linear-gradient(180deg, #09030f 0%, #0f051a 50%, #09030f 100%)"
            : "linear-gradient(180deg, #f8f5ff 0%, #f3e8ff 50%, #f8f5ff 100%)",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(ellipse, #7c22d4 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <div
            className={cn(
              "inline-flex items-center gap-2 text-xs tracking-[0.4em] uppercase font-body mb-4 px-4 py-2 rounded-full border",
              theme === "dark"
                ? "text-purple-400 border-purple-800/50 bg-purple-900/20"
                : "text-purple-600 border-purple-200 bg-purple-50"
            )}
          >
            <Star size={12} /> Our Services
          </div>
          <h2
            className="font-display font-bold text-4xl md:text-5xl mb-4"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #f3e8ff 0%, #c084fc 60%)"
                  : "linear-gradient(135deg, #4c1d95 0%, #7c22d4 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Rise to Power
          </h2>
          <p
            className={cn(
              "font-body text-lg max-w-xl mx-auto",
              theme === "dark" ? "text-purple-300/70" : "text-purple-500"
            )}
          >
            Professional Rise of Kingdoms services tailored to your goals
          </p>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <ServiceCard key={product.id} product={product} theme={theme} index={idx} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/services"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all duration-300",
              theme === "dark"
                ? "border-purple-700 text-purple-300 hover:border-purple-500 hover:bg-purple-900/20"
                : "border-purple-300 text-purple-700 hover:border-purple-500 hover:bg-purple-50"
            )}
          >
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  product,
  theme,
  index,
}: {
  product: Product;
  theme: "dark" | "light";
  index: number;
}) {
  const icon = product.category ? categoryIcons[product.category] : <Star size={20} />;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border p-6 transition-all duration-500 cursor-pointer overflow-hidden",
        theme === "dark"
          ? "bg-gradient-to-br from-dark-100/80 to-dark-200/60 border-purple-900/40 hover:border-purple-700/60"
          : "bg-white/80 border-purple-100 hover:border-purple-300"
      )}
      style={{
        boxShadow:
          theme === "dark"
            ? "0 4px 30px rgba(0,0,0,0.4)"
            : "0 4px 20px rgba(147,51,234,0.08)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(124,34,212,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "p-2.5 rounded-xl",
            theme === "dark"
              ? "bg-purple-900/40 text-purple-400"
              : "bg-purple-100 text-purple-600"
          )}
        >
          {icon}
        </div>
        <span
          className="font-display font-bold text-xl"
          style={{
            background: "linear-gradient(135deg, #c084fc, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {formatPrice(product.price, product.currency)}
        </span>
      </div>

      {/* Content */}
      <h3
        className={cn(
          "font-display font-semibold text-lg mb-2",
          theme === "dark" ? "text-purple-100" : "text-purple-900"
        )}
      >
        {product.name}
      </h3>
      <p
        className={cn(
          "font-body text-sm leading-relaxed mb-6",
          theme === "dark" ? "text-purple-300/60" : "text-purple-500"
        )}
      >
        {product.description}
      </p>

      {/* Buy button */}
      <Link
        href="/auth/signup"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 group-hover:shadow-lg"
        style={{
          background: "linear-gradient(135deg, #7c22d4, #a855f7)",
          boxShadow: "0 0 0 rgba(168,85,247,0)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(168,85,247,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 rgba(168,85,247,0)";
        }}
      >
        <ShoppingCart size={15} />
        Order Now
      </Link>
    </div>
  );
}
