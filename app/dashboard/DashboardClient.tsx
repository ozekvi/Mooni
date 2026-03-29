"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, ShoppingBag, User, LogOut, Shield,
  Crown, CheckCircle, Clock, XCircle, Gem, Zap, Swords,
  Users, Star, ChevronRight, Moon, Sun, ShoppingCart
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import MoonIcon from "@/components/ui/MoonIcon";

interface Order {
  id: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  product: { name: string; category?: string };
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category?: string;
}

interface Props {
  user: any;
  orders: Order[];
  products: Product[];
  isAdmin: boolean;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  completed: { icon: <CheckCircle size={14} />, color: "text-emerald-400", label: "Completed" },
  pending:   { icon: <Clock size={14} />,       color: "text-amber-400",   label: "Pending"   },
  expired:   { icon: <XCircle size={14} />,     color: "text-red-400",     label: "Expired"   },
  failed:    { icon: <XCircle size={14} />,     color: "text-red-400",     label: "Failed"    },
};

const categoryIcons: Record<string, React.ReactNode> = {
  leveling: <Zap size={18} />, gems: <Gem size={18} />, alliance: <Users size={18} />,
  pvp: <Swords size={18} />, vip: <Crown size={18} />,
};

export default function DashboardClient({ user, orders, products, isAdmin }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "shop" | "profile">("overview");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const isDark = theme === "dark";
  const bg       = isDark ? "#09030f"              : "#f8f5ff";
  const cardBg   = isDark ? "rgba(26,10,46,0.8)"   : "rgba(255,255,255,0.9)";
  const border   = isDark ? "rgba(59,7,100,0.5)"   : "rgba(216,180,254,0.5)";
  const textMain = isDark ? "#f3e8ff"              : "#3b0764";
  const textSub  = isDark ? "#a78bfa"              : "#7c3aed";
  const textMuted= isDark ? "#6d28d9"              : "#a78bfa";

  const completed   = orders.filter(o => o.status === "completed").length;
  const totalSpent  = orders.filter(o => o.status === "completed").reduce((s, o) => s + o.amount, 0);

  const tabs = [
    { id: "overview", icon: <LayoutDashboard size={18} />, label: "Overview" },
    { id: "orders",   icon: <ShoppingBag size={18} />,     label: "Orders"   },
    { id: "shop",     icon: <ShoppingCart size={18} />,    label: "Shop"     },
    { id: "profile",  icon: <User size={18} />,            label: "Profile"  },
  ];

  const handleBuy = async (productId: string) => {
    setBuyingId(productId);
    try {
      const res  = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { setBuyingId(null); }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: bg, color: textMain }}>

      {/* ── Sidebar ── */}
      <aside className="w-64 min-h-screen flex-col border-r hidden lg:flex"
        style={{ background: isDark ? "rgba(15,5,26,0.98)" : "rgba(248,245,255,0.98)", borderColor: border }}>

        {/* Logo */}
        <div className="p-6 border-b flex items-center gap-3" style={{ borderColor: border }}>
          <MoonIcon size={40} />
          <div>
            <div className="font-display font-bold tracking-widest text-sm"
              style={{ background: "linear-gradient(135deg,#c084fc,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              MOONI
            </div>
            <div className="text-xs font-body" style={{ color: textMuted }}>Services</div>
          </div>
        </div>

        {/* Avatar */}
        <div className="p-4 m-4 rounded-2xl border"
          style={{ background: isDark ? "rgba(88,28,135,0.15)" : "rgba(233,213,255,0.3)", borderColor: border }}>
          <div className="flex items-center gap-3 mb-2">
            {user?.image
              ? <img src={user.image} alt="" className="w-10 h-10 rounded-full border-2 border-purple-600" />
              : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
            }
            <div className="overflow-hidden">
              <div className="font-body font-semibold text-sm truncate" style={{ color: textMain }}>{user?.name || "User"}</div>
              <div className="text-xs truncate" style={{ color: textMuted }}>{user?.email}</div>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold px-2 py-1 rounded-lg w-fit"
              style={{ background: "rgba(124,34,212,0.3)", color: "#c084fc" }}>
              <Shield size={11} /> Admin
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                activeTab === tab.id ? "text-white" : isDark ? "text-purple-400 hover:text-purple-200" : "text-purple-600 hover:text-purple-900")}
              style={activeTab === tab.id ? { background: "linear-gradient(135deg,#7c22d4,#a855f7)", boxShadow: "0 4px 15px rgba(168,85,247,0.3)" } : {}}>
              {tab.icon} {tab.label}
            </button>
          ))}
          {isAdmin && (
            <Link href="/admin"
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isDark ? "text-purple-400 hover:text-purple-200" : "text-purple-600 hover:text-purple-900")}>
              <Shield size={18} /> Admin Panel
            </Link>
          )}
        </nav>

        {/* Bottom */}
        <div className="p-4 space-y-1 border-t" style={{ borderColor: border }}>
          <button onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all",
              isDark ? "text-purple-400 hover:text-purple-200" : "text-purple-600 hover:text-purple-900")}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition-all text-left">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between"
          style={{ background: isDark ? "rgba(9,3,15,0.9)" : "rgba(248,245,255,0.9)", backdropFilter: "blur(12px)", borderColor: border }}>
          <h1 className="font-display font-bold text-lg capitalize" style={{ color: textMain }}>{activeTab}</h1>
          {/* Mobile tabs */}
          <div className="lg:hidden flex gap-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                className="p-2 rounded-lg transition-all"
                style={activeTab === t.id ? { background: "linear-gradient(135deg,#7c22d4,#a855f7)", color: "#fff" } : { color: textMuted }}>
                {t.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* ─ OVERVIEW ─ */}
          {activeTab === "overview" && (
            <div className="space-y-6" style={{ animation: "fadeInUp 0.5s ease-out both" }}>
              {/* Banner */}
              <div className="relative rounded-3xl overflow-hidden p-8"
                style={{ background: "linear-gradient(135deg,rgba(88,28,135,0.6),rgba(124,34,212,0.4),rgba(9,3,15,0.8))", border: `1px solid ${border}` }}>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
                  <MoonIcon size={120} />
                </div>
                <h2 className="font-display font-bold text-2xl text-white mb-1">
                  Welcome back, {user?.name?.split(" ")[0] || "Warrior"}! ⚔️
                </h2>
                <p className="text-purple-300 font-body text-sm">Ready to dominate the Kingdom?</p>
                <button onClick={() => setActiveTab("shop")}
                  className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2 transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#7c22d4,#a855f7)", boxShadow: "0 4px 15px rgba(168,85,247,0.4)" }}>
                  Browse Services <ChevronRight size={15} />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Orders",  value: orders.length,    icon: <ShoppingBag size={20} />, color: "#a855f7" },
                  { label: "Completed",     value: completed,         icon: <CheckCircle size={20} />, color: "#34d399" },
                  { label: "Total Spent",   value: formatPrice(totalSpent), icon: <Gem size={20} />, color: "#f59e0b" },
                  { label: "Member Since",  value: new Date(user?.createdAt).toLocaleDateString("en",{month:"short",year:"numeric"}),
                    icon: <Star size={20} />, color: "#c084fc" },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl p-5 border" style={{ background: cardBg, borderColor: border }}>
                    <div className="mb-3" style={{ color: s.color }}>{s.icon}</div>
                    <div className="font-display font-bold text-xl" style={{ color: textMain }}>{s.value}</div>
                    <div className="text-xs font-body mt-1" style={{ color: textMuted }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              {orders.length > 0 && (
                <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
                  <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: border }}>
                    <h3 className="font-display font-semibold" style={{ color: textMain }}>Recent Orders</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-xs" style={{ color: textSub }}>View all →</button>
                  </div>
                  {orders.slice(0, 3).map(order => {
                    const st = statusConfig[order.status] || statusConfig.pending;
                    return (
                      <div key={order.id} className="flex items-center justify-between px-5 py-4 border-b last:border-b-0" style={{ borderColor: border }}>
                        <div>
                          <div className="text-sm font-medium" style={{ color: textMain }}>{order.product.name}</div>
                          <div className="text-xs mt-0.5" style={{ color: textMuted }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={cn("flex items-center gap-1 text-xs font-medium", st.color)}>{st.icon} {st.label}</span>
                          <span className="text-sm font-bold" style={{ color: textMain }}>{formatPrice(order.amount, order.currency)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─ ORDERS ─ */}
          {activeTab === "orders" && (
            <div className="space-y-4" style={{ animation: "fadeInUp 0.5s ease-out both" }}>
              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" style={{ color: textSub }} />
                  <p className="font-body" style={{ color: textMuted }}>No orders yet.</p>
                  <button onClick={() => setActiveTab("shop")} className="mt-4 text-sm underline" style={{ color: textSub }}>Browse services →</button>
                </div>
              ) : orders.map(order => {
                const st = statusConfig[order.status] || statusConfig.pending;
                return (
                  <div key={order.id} className="rounded-2xl border p-5 flex items-center justify-between gap-4"
                    style={{ background: cardBg, borderColor: border }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,34,212,0.2)", color: "#a855f7" }}>
                        {categoryIcons[order.product.category || ""] || <ShoppingBag size={18} />}
                      </div>
                      <div>
                        <div className="font-medium text-sm" style={{ color: textMain }}>{order.product.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: textMuted }}>{new Date(order.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <span className={cn("flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg", st.color)}
                        style={{ background: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.06)" }}>
                        {st.icon} {st.label}
                      </span>
                      <span className="font-bold text-sm" style={{ color: textMain }}>{formatPrice(order.amount, order.currency)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─ SHOP ─ */}
          {activeTab === "shop" && (
            <div className="space-y-5" style={{ animation: "fadeInUp 0.5s ease-out both" }}>
              <p className="text-sm font-body" style={{ color: textMuted }}>Secure payments via Stripe.</p>
              {products.length === 0 ? (
                <div className="text-center py-20">
                  <Star size={48} className="mx-auto mb-4 opacity-20" style={{ color: textSub }} />
                  <p style={{ color: textMuted }}>No services available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map(product => (
                    <div key={product.id} className="group rounded-2xl border p-6 transition-all duration-300 hover:border-purple-600/50"
                      style={{ background: cardBg, borderColor: border }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 rounded-xl" style={{ background: "rgba(124,34,212,0.2)", color: "#a855f7" }}>
                          {categoryIcons[product.category || ""] || <Star size={18} />}
                        </div>
                        <span className="font-display font-bold text-xl"
                          style={{ background: "linear-gradient(135deg,#c084fc,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          {formatPrice(product.price, product.currency)}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold mb-2" style={{ color: textMain }}>{product.name}</h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: textMuted }}>{product.description}</p>
                      <button onClick={() => handleBuy(product.id)} disabled={buyingId === product.id}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg,#7c22d4,#a855f7)", boxShadow: "0 4px 15px rgba(168,85,247,0.25)" }}>
                        {buyingId === product.id
                          ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                          : <><ShoppingCart size={15} /> Purchase</>}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─ PROFILE ─ */}
          {activeTab === "profile" && (
            <div className="max-w-lg space-y-5" style={{ animation: "fadeInUp 0.5s ease-out both" }}>
              <div className="rounded-2xl border p-6" style={{ background: cardBg, borderColor: border }}>
                <div className="flex items-center gap-5 mb-6">
                  {user?.image
                    ? <img src={user.image} alt="" className="w-16 h-16 rounded-2xl border-2 border-purple-600" />
                    : <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center text-white font-display font-bold text-2xl">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                  }
                  <div>
                    <h2 className="font-display font-bold text-xl" style={{ color: textMain }}>{user?.name}</h2>
                    <p className="text-sm mt-1" style={{ color: textMuted }}>{user?.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-3 py-1 rounded-lg"
                        style={{ background: "rgba(124,34,212,0.3)", color: "#c084fc" }}>
                        <Shield size={12} /> Administrator
                      </span>
                    )}
                  </div>
                </div>
                {[
                  { label: "Name",         value: user?.name || "—" },
                  { label: "Email",        value: user?.email || "—" },
                  { label: "Discord",      value: user?.discordId ? `Connected` : "Not connected" },
                  { label: "Member since", value: new Date(user?.createdAt).toLocaleDateString("en",{ year:"numeric", month:"long", day:"numeric" }) },
                ].map(f => (
                  <div key={f.label} className="flex justify-between py-3 border-b last:border-b-0" style={{ borderColor: border }}>
                    <span className="text-sm" style={{ color: textMuted }}>{f.label}</span>
                    <span className="text-sm font-medium" style={{ color: textMain }}>{f.value}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full py-3 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 text-red-400 border-red-900/40 hover:bg-red-900/20 transition-all">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
