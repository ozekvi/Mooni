"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Shield, Package, Users, ShoppingBag, Plus, Trash2, LogOut,
  CheckCircle, Clock, XCircle, LayoutDashboard, X, DollarSign,
  TrendingUp, Eye, EyeOff
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import MoonIcon from "@/components/ui/MoonIcon";

interface Product { id: string; name: string; description: string; price: number; currency: string; category?: string; active: boolean; createdAt: string; }
interface Order { id: string; status: string; amount: number; currency: string; createdAt: string; user: { name: string; email: string }; product: { name: string }; }
interface User { id: string; name: string; email: string; role: string; createdAt: string; discordId?: string; }

const statusConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  completed: { icon: <CheckCircle size={13} />, color: "text-emerald-400" },
  pending: { icon: <Clock size={13} />, color: "text-amber-400" },
  expired: { icon: <XCircle size={13} />, color: "text-red-400" },
  failed: { icon: <XCircle size={13} />, color: "text-red-400" },
};

const CATEGORIES = ["leveling", "gems", "alliance", "pvp", "defense", "vip", "other"];

export default function AdminClient({ products: initialProducts, orders, users }: { products: Product[], orders: Order[], users: User[] }) {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "users">("overview");
  const [products, setProducts] = useState(initialProducts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", currency: "usd", category: "leveling", image: "" });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const totalRevenue = orders.filter(o => o.status === "completed").reduce((s, o) => s + o.amount, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "completed").length;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts([data, ...products]);
      setShowCreateModal(false);
      setForm({ name: "", description: "", price: "", currency: "usd", category: "leveling", image: "" });
    } catch (err: any) { setFormError(err.message); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this product?")) return;
    setDeleting(id);
    await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setProducts(products.map(p => p.id === id ? { ...p, active: false } : p));
    setDeleting(null);
  };

  const bg = "#09030f";
  const cardBg = "rgba(26,10,46,0.8)";
  const border = "rgba(59,7,100,0.5)";

  const tabs = [
    { id: "overview", icon: <LayoutDashboard size={17} />, label: "Overview" },
    { id: "products", icon: <Package size={17} />, label: "Products" },
    { id: "orders", icon: <ShoppingBag size={17} />, label: "Orders" },
    { id: "users", icon: <Users size={17} />, label: "Users" },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: bg, color: "#f3e8ff" }}>

      {/* Sidebar */}
      <aside className="w-60 min-h-screen flex flex-col border-r hidden lg:flex" style={{ background: "rgba(15,5,26,0.98)", borderColor: border }}>
        <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: border }}>
          <MoonIcon size={38} />
          <div>
            <div className="font-display font-bold text-sm tracking-widest" style={{ background: "linear-gradient(135deg,#c084fc,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MOONI</div>
            <div className="flex items-center gap-1 text-xs text-purple-500 mt-0.5"><Shield size={10} /> Admin</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                activeTab === tab.id ? "text-white" : "text-purple-400 hover:text-purple-200")}
              style={activeTab === tab.id ? { background: "linear-gradient(135deg,#7c22d4,#a855f7)" } : {}}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-3 space-y-1 border-t" style={{ borderColor: border }}>
          <Link href="/dashboard"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-purple-400 hover:text-purple-200 transition-all">
            <LayoutDashboard size={16} /> My Dashboard
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition-all text-left">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between"
          style={{ background: "rgba(9,3,15,0.9)", backdropFilter: "blur(12px)", borderColor: border }}>
          <h1 className="font-display font-bold text-lg capitalize text-purple-100">{activeTab}</h1>
          {activeTab === "products" && (
            <button onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#7c22d4,#a855f7)" }}>
              <Plus size={16} /> New Product
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: formatPrice(totalRevenue), icon: <DollarSign size={20} />, color: "#34d399" },
                  { label: "Total Orders", value: totalOrders, icon: <ShoppingBag size={20} />, color: "#a855f7" },
                  { label: "Completed", value: completedOrders, icon: <CheckCircle size={20} />, color: "#34d399" },
                  { label: "Active Products", value: products.filter(p => p.active).length, icon: <Package size={20} />, color: "#c084fc" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl p-5 border" style={{ background: cardBg, borderColor: border }}>
                    <div className="mb-3" style={{ color: stat.color }}>{stat.icon}</div>
                    <div className="font-display font-bold text-xl text-purple-100">{stat.value}</div>
                    <div className="text-xs text-purple-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent orders preview */}
              <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
                <div className="p-5 border-b" style={{ borderColor: border }}>
                  <h3 className="font-display font-semibold text-purple-100">Recent Orders</h3>
                </div>
                <div>
                  {orders.slice(0, 5).map((order) => {
                    const st = statusConfig[order.status] || statusConfig.pending;
                    return (
                      <div key={order.id} className="flex items-center justify-between px-5 py-4 border-b last:border-0" style={{ borderColor: border }}>
                        <div>
                          <div className="text-sm font-medium text-purple-200">{order.product.name}</div>
                          <div className="text-xs text-purple-600 mt-0.5">{order.user.email}</div>
                        </div>
                        <div className="flex items-center gap-5">
                          <span className={cn("flex items-center gap-1 text-xs font-medium", st.color)}>{st.icon} {order.status}</span>
                          <span className="text-sm font-bold text-purple-200">{formatPrice(order.amount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-4">
              {products.length === 0 && <p className="text-purple-500 text-center py-16">No products yet. Create one!</p>}
              {products.map(product => (
                <div key={product.id} className="rounded-2xl border p-5 flex items-center justify-between gap-4"
                  style={{ background: cardBg, borderColor: border, opacity: product.active ? 1 : 0.5 }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-purple-100 truncate">{product.name}</h3>
                      {!product.active && <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-400">Inactive</span>}
                    </div>
                    <p className="text-sm text-purple-500 truncate">{product.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs px-2 py-1 rounded-lg bg-purple-900/30 text-purple-400">{product.category}</span>
                      <span className="font-bold text-purple-300">{formatPrice(product.price, product.currency)}</span>
                    </div>
                  </div>
                  {product.active && (
                    <button onClick={() => handleDelete(product.id)} disabled={deleting === product.id}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-900/20 transition-all disabled:opacity-50">
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-3">
              {orders.map(order => {
                const st = statusConfig[order.status] || statusConfig.pending;
                return (
                  <div key={order.id} className="rounded-2xl border p-5 flex items-center justify-between gap-4"
                    style={{ background: cardBg, borderColor: border }}>
                    <div>
                      <div className="text-sm font-semibold text-purple-100">{order.product.name}</div>
                      <div className="text-xs text-purple-500 mt-0.5">{order.user.name} · {order.user.email}</div>
                      <div className="text-xs text-purple-700 mt-0.5">{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-5">
                      <span className={cn("flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg", st.color)} style={{ background: "rgba(0,0,0,0.3)" }}>
                        {st.icon} {order.status}
                      </span>
                      <span className="text-sm font-bold text-purple-200">{formatPrice(order.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: border }}>
                    {["User", "Email", "Role", "Discord", "Joined"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-purple-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: border }}>
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-purple-900/10 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-purple-200">{u.name || "—"}</td>
                      <td className="px-5 py-3.5 text-purple-400">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn("text-xs px-2 py-1 rounded-lg", u.role === "admin" ? "bg-purple-900/40 text-purple-300" : "bg-dark-300/40 text-purple-600")}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-purple-600">{u.discordId ? "✓ Connected" : "—"}</td>
                      <td className="px-5 py-3.5 text-xs text-purple-700">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-lg rounded-3xl border overflow-hidden"
            style={{ background: "linear-gradient(135deg,rgba(26,10,46,0.99),rgba(9,3,15,0.99))", borderColor: border }}>

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: border }}>
              <h2 className="font-display font-bold text-lg text-purple-100">Create New Product</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-purple-500 hover:text-purple-200 transition-colors">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-900/20 border border-red-800/40 text-red-400 text-sm">{formError}</div>
              )}

              {[
                { label: "Product Name", field: "name", type: "text", placeholder: "e.g. Power Leveling Package" },
                { label: "Price (USD)", field: "price", type: "number", placeholder: "29.99" },
                { label: "Image URL (optional)", field: "image", type: "url", placeholder: "https://..." },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type} placeholder={placeholder} value={(form as any)[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    required={field !== "image"}
                    step={field === "price" ? "0.01" : undefined}
                    min={field === "price" ? "0.01" : undefined}
                    className="w-full px-4 py-3 rounded-xl border bg-purple-950/30 text-purple-100 placeholder-purple-700 border-purple-800/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm transition-all" />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border bg-purple-950/30 text-purple-100 border-purple-800/50 focus:border-purple-500 focus:outline-none text-sm transition-all">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  required rows={3} placeholder="Describe what this service includes..."
                  className="w-full px-4 py-3 rounded-xl border bg-purple-950/30 text-purple-100 placeholder-purple-700 border-purple-800/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm resize-none transition-all" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-purple-800 text-purple-400 hover:border-purple-600 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#7c22d4,#a855f7)", boxShadow: "0 4px 15px rgba(168,85,247,0.3)" }}>
                  {creating ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : <><Plus size={16} /> Create Product</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
