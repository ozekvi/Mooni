"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LayoutDashboard, ShoppingBag, User, LogOut, Shield, Crown, CheckCircle, Clock, XCircle, Gem, Zap, Swords, Users, Star, ShoppingCart, Home, ChevronRight, Package, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import MoonImage from "@/components/ui/MoonImage";

const icons: Record<string,any> = { leveling:<Zap size={18}/>, gems:<Gem size={18}/>, alliance:<Users size={18}/>, pvp:<Swords size={18}/>, vip:<Crown size={18}/>, defense:<Shield size={18}/> };
const statusCfg: Record<string,any> = {
  completed: { icon:<CheckCircle size={13}/>, color:"#34d399", bg:"rgba(52,211,153,0.1)", label:"Completed" },
  pending:   { icon:<Clock size={13}/>,       color:"#fbbf24", bg:"rgba(251,191,36,0.1)",  label:"Pending" },
  expired:   { icon:<XCircle size={13}/>,     color:"#f87171", bg:"rgba(248,113,113,0.1)", label:"Expired" },
  failed:    { icon:<XCircle size={13}/>,     color:"#f87171", bg:"rgba(248,113,113,0.1)", label:"Failed" },
};

const TABS = [
  { id:"overview", icon:<LayoutDashboard size={17}/>, label:"Overview" },
  { id:"orders",   icon:<ShoppingBag size={17}/>,     label:"My Orders" },
  { id:"shop",     icon:<ShoppingCart size={17}/>,    label:"Shop" },
  { id:"profile",  icon:<User size={17}/>,            label:"Profile" },
];

export default function DashboardClient({ user, orders, products, isAdmin }: any) {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [buyingId, setBuyingId] = useState<string|null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const completed = orders.filter((o:any) => o.status === "completed");
  const totalSpent = completed.reduce((s:number, o:any) => s + o.amount, 0);

  const handleBuy = async (productId: string) => {
    setBuyingId(productId);
    try {
      const res = await fetch("/api/checkout", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({productId}) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setBuyingId(null);
    } catch { setBuyingId(null); }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid rgba(88,28,135,0.25)" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <MoonImage size={36} />
          <span style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:800, fontSize:16, letterSpacing:"0.25em", background:"linear-gradient(135deg,#e9d5ff,#c084fc,#9333ea)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>MOONI</span>
        </Link>
      </div>

      {/* User card */}
      <div style={{ margin:"16px 12px", padding:"14px 16px", borderRadius:16, background:"rgba(88,28,135,0.12)", border:"1px solid rgba(124,34,212,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {user?.image
            ? <img src={user.image} alt="" style={{ width:44, height:44, borderRadius:"50%", border:"2px solid rgba(168,85,247,0.5)", objectFit:"cover" }} />
            : <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#5b21b6,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"white" }}>{user?.name?.[0]?.toUpperCase()||"U"}</div>
          }
          <div style={{ minWidth:0 }}>
            <p style={{ fontWeight:700, fontSize:14, color:"#f0e8ff", margin:"0 0 2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"var(--font-space), sans-serif" }}>{user?.name||"User"}</p>
            <p style={{ fontSize:11, color:"rgba(167,139,250,0.55)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.email||""}</p>
          </div>
        </div>
        {isAdmin && <div style={{ marginTop:10, display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:100, background:"rgba(192,132,252,0.15)", border:"1px solid rgba(192,132,252,0.25)", fontSize:11, fontWeight:700, color:"#c084fc", letterSpacing:"0.06em" }}><Shield size={10}/> ADMINISTRATOR</div>}
      </div>

      {/* Nav */}
      <nav style={{ padding:"0 12px", flex:1 }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false); }}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14, border:"none", cursor:"pointer", marginBottom:4, transition:"all 0.2s", textAlign:"left", fontFamily:"var(--font-space), sans-serif", fontSize:14, fontWeight:600,
                background: active ? "linear-gradient(135deg, rgba(91,33,182,0.6), rgba(147,51,234,0.4))" : "transparent",
                color: active ? "#f0e8ff" : "rgba(196,168,255,0.65)",
                boxShadow: active ? "0 4px 16px rgba(88,28,135,0.25)" : "none",
                borderColor: active ? "rgba(168,85,247,0.25)" : "transparent",
              }}>
              <span style={{ color: active ? "#c084fc" : "rgba(167,139,250,0.5)" }}>{t.icon}</span>
              {t.label}
              {active && <ChevronRight size={14} style={{ marginLeft:"auto", color:"rgba(192,132,252,0.6)" }} />}
            </button>
          );
        })}
        {isAdmin && (
          <Link href="/admin"
            style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14, border:"1px solid rgba(192,132,252,0.2)", textDecoration:"none", marginTop:8, background:"rgba(192,132,252,0.05)", color:"rgba(196,168,255,0.7)", fontFamily:"var(--font-space), sans-serif", fontSize:14, fontWeight:600 }}>
            <Shield size={17} style={{ color:"#c084fc" }}/> Admin Panel
          </Link>
        )}
      </nav>

      {/* Bottom */}
      <div style={{ padding:"12px 12px 20px", borderTop:"1px solid rgba(88,28,135,0.2)" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:12, color:"rgba(167,139,250,0.6)", textDecoration:"none", fontSize:13, fontFamily:"var(--font-space), sans-serif", marginBottom:4 }}>
          <Home size={15}/> Home
        </Link>
        <button onClick={() => signOut({ callbackUrl:"/" })} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", borderRadius:12, background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#f87171", textAlign:"left", fontFamily:"var(--font-space), sans-serif" }}>
          <LogOut size={15}/> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"#07020f", color:"#f0e8ff", fontFamily:"var(--font-plus), sans-serif" }}>

      {/* Desktop Sidebar */}
      <aside className="dash-sidebar" style={{ width:260, minHeight:"100vh", display:"flex", flexDirection:"column", borderRight:"1px solid rgba(88,28,135,0.2)", background:"rgba(10,3,22,0.95)", backdropFilter:"blur(24px)", position:"sticky", top:0, height:"100vh" }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:200 }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }} onClick={() => setSidebarOpen(false)} />
          <aside style={{ position:"absolute", left:0, top:0, bottom:0, width:280, display:"flex", flexDirection:"column", background:"rgba(10,3,22,0.99)", borderRight:"1px solid rgba(88,28,135,0.3)" }}>
            <button onClick={() => setSidebarOpen(false)} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", color:"#a78bfa", fontSize:24 }}>✕</button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"auto", minWidth:0 }}>

        {/* Top bar */}
        <header style={{ position:"sticky", top:0, zIndex:50, padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(7,2,15,0.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(88,28,135,0.18)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <button className="dash-burger" onClick={() => setSidebarOpen(true)} style={{ display:"none", background:"none", border:"none", cursor:"pointer", color:"#a78bfa", padding:4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <h1 style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:18, color:"#f0e8ff", textTransform:"capitalize" }}>{TABS.find(t=>t.id===tab)?.label || tab}</h1>
              <p style={{ fontSize:11, color:"rgba(167,139,250,0.4)", fontFamily:"var(--font-space), sans-serif" }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {user?.image
              ? <img src={user.image} alt="" style={{ width:36, height:36, borderRadius:"50%", border:"2px solid rgba(168,85,247,0.4)", objectFit:"cover" }} />
              : <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#5b21b6,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"white" }}>{user?.name?.[0]?.toUpperCase()||"U"}</div>
            }
          </div>
        </header>

        <div style={{ flex:1, padding:"28px 24px 40px" }}>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:24, animation:"fadeInUp 0.4s ease-out" }}>

              {/* Welcome banner */}
              <div style={{ position:"relative", borderRadius:24, overflow:"hidden", padding:"36px 40px", background:"linear-gradient(135deg, rgba(91,33,182,0.5) 0%, rgba(124,34,212,0.3) 50%, rgba(10,3,22,0.8) 100%)", border:"1px solid rgba(168,85,247,0.2)" }}>
                <div style={{ position:"absolute", right:-20, top:"50%", transform:"translateY(-50%)", opacity:0.15 }}>
                  <MoonImage size={160} />
                </div>
                <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 80% 50%, rgba(192,132,252,0.08) 0%, transparent 60%)" }} />
                <div style={{ position:"relative" }}>
                  <p style={{ fontFamily:"var(--font-space), sans-serif", fontSize:13, color:"rgba(192,132,252,0.7)", letterSpacing:"0.1em", marginBottom:8 }}>Welcome back</p>
                  <h2 style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:"clamp(22px,4vw,30px)", color:"#f0e8ff", marginBottom:10 }}>
                    {user?.name?.split(" ")[0] || "Warrior"} ⚔️
                  </h2>
                  <p style={{ fontSize:14, color:"rgba(216,180,254,0.65)", marginBottom:24, fontFamily:"var(--font-space), sans-serif" }}>Ready to dominate the Kingdom today?</p>
                  <button onClick={() => setTab("shop")} style={{ padding:"11px 24px", borderRadius:100, background:"linear-gradient(135deg,#5b21b6,#9333ea)", border:"none", cursor:"pointer", color:"white", fontSize:14, fontWeight:700, fontFamily:"var(--font-space), sans-serif", boxShadow:"0 0 20px rgba(147,51,234,0.4)", display:"inline-flex", alignItems:"center", gap:8 }}>
                    <ShoppingCart size={15}/> Browse Services
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16 }}>
                {[
                  { label:"Total Orders",  value:orders.length,         icon:<Package size={20}/>,    color:"#a855f7", glow:"rgba(168,85,247,0.2)" },
                  { label:"Completed",     value:completed.length,      icon:<CheckCircle size={20}/>,color:"#34d399", glow:"rgba(52,211,153,0.15)" },
                  { label:"Total Spent",   value:formatPrice(totalSpent),icon:<TrendingUp size={20}/>, color:"#fbbf24", glow:"rgba(251,191,36,0.15)" },
                  { label:"Member Since",  value:new Date(user?.createdAt).toLocaleDateString("en",{month:"short",year:"numeric"}), icon:<Star size={20}/>, color:"#c084fc", glow:"rgba(192,132,252,0.15)" },
                ].map(s => (
                  <div key={s.label} style={{ padding:"22px 20px", borderRadius:20, background:"rgba(16,6,34,0.8)", border:"1px solid rgba(88,28,135,0.22)", boxShadow:`0 0 30px ${s.glow}` }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:`rgba(${s.color==='#a855f7'?'168,85,247':s.color==='#34d399'?'52,211,153':s.color==='#fbbf24'?'251,191,36':'192,132,252'},0.15)`, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, marginBottom:14 }}>{s.icon}</div>
                    <p style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:24, color:"#f0e8ff", margin:"0 0 4px" }}>{s.value}</p>
                    <p style={{ fontSize:12, color:"rgba(167,139,250,0.5)", fontFamily:"var(--font-space), sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders - decorated */}
              {orders.length > 0 && (
                <div style={{ borderRadius:22, overflow:"hidden", border:"1px solid rgba(88,28,135,0.22)", background:"rgba(12,4,26,0.8)" }}>
                  <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid rgba(88,28,135,0.18)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:"#a855f7", boxShadow:"0 0 8px #a855f7" }} />
                      <h3 style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:16, color:"#f0e8ff" }}>Recent Orders</h3>
                    </div>
                    <button onClick={() => setTab("orders")} style={{ fontSize:12, color:"rgba(192,132,252,0.7)", background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-space), sans-serif" }}>View all →</button>
                  </div>
                  {orders.slice(0,4).map((order:any, idx:number) => {
                    const st = statusCfg[order.status] || statusCfg.pending;
                    return (
                      <div key={order.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", borderBottom: idx < 3 && idx < orders.slice(0,4).length-1 ? "1px solid rgba(59,7,100,0.2)" : "none", gap:16 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                          <div style={{ width:42, height:42, borderRadius:14, background:"rgba(88,28,135,0.2)", border:"1px solid rgba(124,34,212,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#a855f7", flexShrink:0 }}>
                            {order.product?.category ? icons[order.product.category]||<Package size={18}/> : <Package size={18}/>}
                          </div>
                          <div>
                            <p style={{ fontWeight:600, fontSize:14, color:"#e9d5ff", marginBottom:3, fontFamily:"var(--font-space), sans-serif" }}>{order.product?.name}</p>
                            <p style={{ fontSize:11, color:"rgba(167,139,250,0.45)" }}>{new Date(order.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:100, background:st.bg, color:st.color, fontSize:12, fontWeight:600, fontFamily:"var(--font-space), sans-serif", border:`1px solid ${st.color}25` }}>
                            {st.icon} {st.label}
                          </span>
                          <span style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:15, color:"#c084fc" }}>{formatPrice(order.amount,order.currency)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === "orders" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12, animation:"fadeInUp 0.4s ease-out" }}>
              {orders.length === 0 ? (
                <div style={{ textAlign:"center", padding:"80px 0" }}>
                  <ShoppingBag size={48} style={{ color:"rgba(107,33,168,0.3)", margin:"0 auto 16px" }} />
                  <p style={{ color:"rgba(107,33,168,0.6)", fontFamily:"var(--font-space), sans-serif" }}>No orders yet</p>
                  <button onClick={() => setTab("shop")} style={{ marginTop:16, padding:"10px 22px", borderRadius:100, background:"linear-gradient(135deg,#5b21b6,#9333ea)", border:"none", cursor:"pointer", color:"white", fontSize:13, fontWeight:600, fontFamily:"var(--font-space), sans-serif" }}>Browse Services</button>
                </div>
              ) : orders.map((order:any) => {
                const st = statusCfg[order.status] || statusCfg.pending;
                return (
                  <div key={order.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px", borderRadius:18, background:"rgba(12,4,26,0.8)", border:"1px solid rgba(88,28,135,0.22)", gap:16, flexWrap:"wrap" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:46, height:46, borderRadius:14, background:"rgba(88,28,135,0.2)", border:"1px solid rgba(124,34,212,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#a855f7", flexShrink:0 }}>
                        {order.product?.category ? icons[order.product.category]||<Package size={20}/> : <Package size={20}/>}
                      </div>
                      <div>
                        <p style={{ fontWeight:600, fontSize:15, color:"#e9d5ff", marginBottom:4, fontFamily:"var(--font-space), sans-serif" }}>{order.product?.name}</p>
                        <p style={{ fontSize:12, color:"rgba(167,139,250,0.45)" }}>{new Date(order.createdAt).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:100, background:st.bg, color:st.color, fontSize:12, fontWeight:600, fontFamily:"var(--font-space), sans-serif", border:`1px solid ${st.color}30` }}>
                        {st.icon} {st.label}
                      </span>
                      <span style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:16, color:"#c084fc" }}>{formatPrice(order.amount,order.currency)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── SHOP ── */}
          {tab === "shop" && (
            <div style={{ animation:"fadeInUp 0.4s ease-out" }}>
              <p style={{ fontSize:14, color:"rgba(167,139,250,0.55)", marginBottom:24, fontFamily:"var(--font-space), sans-serif" }}>Select a service · Secure checkout via Stripe</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
                {products.map((p:any) => (
                  <div key={p.id} style={{ borderRadius:20, border:"1px solid rgba(88,28,135,0.25)", padding:"24px", background:"rgba(14,5,30,0.8)", display:"flex", flexDirection:"column", transition:"all 0.3s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                      <div style={{ padding:10, borderRadius:12, background:"rgba(88,28,135,0.2)", color:"#a855f7" }}>{p.category?icons[p.category]||<Star size={18}/>:<Star size={18}/>}</div>
                      <span style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:20, background:"linear-gradient(135deg,#c084fc,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{formatPrice(p.price,p.currency)}</span>
                    </div>
                    <h3 style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:600, fontSize:16, color:"#f0e8ff", marginBottom:10 }}>{p.name}</h3>
                    <p style={{ fontSize:13, lineHeight:1.65, color:"rgba(167,139,250,0.55)", flex:1, marginBottom:20 }}>{p.description}</p>
                    <button onClick={() => handleBuy(p.id)} disabled={!!buyingId} style={{ padding:"12px 0", borderRadius:12, border:"none", cursor:buyingId?"not-allowed":"pointer", background:"linear-gradient(135deg,#5b21b6,#9333ea)", color:"white", fontSize:14, fontWeight:700, fontFamily:"var(--font-space), sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:buyingId?0.7:1, boxShadow:"0 4px 16px rgba(88,28,135,0.3)" }}>
                      {buyingId===p.id ? <><span style={{ width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin 1s linear infinite",display:"inline-block" }}/> Loading…</> : <><ShoppingCart size={15}/> Purchase</>}
                    </button>
                  </div>
                ))}
                {products.length === 0 && <p style={{ color:"rgba(107,33,168,0.5)", gridColumn:"1/-1", textAlign:"center", padding:"60px 0", fontFamily:"var(--font-space), sans-serif" }}>No services available yet.</p>}
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab === "profile" && (
            <div style={{ maxWidth:520, animation:"fadeInUp 0.4s ease-out" }}>
              <div style={{ borderRadius:24, border:"1px solid rgba(88,28,135,0.25)", background:"rgba(12,4,26,0.8)", overflow:"hidden", marginBottom:16 }}>
                {/* Header gradient */}
                <div style={{ height:80, background:"linear-gradient(135deg, rgba(91,33,182,0.4), rgba(147,51,234,0.2))", position:"relative" }}>
                  <div style={{ position:"absolute", bottom:-28, left:28 }}>
                    {user?.image
                      ? <img src={user.image} alt="" style={{ width:56, height:56, borderRadius:"50%", border:"3px solid #07020f", objectFit:"cover" }} />
                      : <div style={{ width:56, height:56, borderRadius:"50%", border:"3px solid #07020f", background:"linear-gradient(135deg,#5b21b6,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, color:"white" }}>{user?.name?.[0]?.toUpperCase()||"U"}</div>
                    }
                  </div>
                </div>
                <div style={{ padding:"36px 28px 28px" }}>
                  <h2 style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:20, color:"#f0e8ff", marginBottom:4 }}>{user?.name}</h2>
                  <p style={{ fontSize:13, color:"rgba(167,139,250,0.5)", marginBottom:20 }}>{user?.email}</p>
                  {[
                    { label:"Email",        value: user?.email || "—" },
                    { label:"Discord",      value: user?.discordId ? `Connected (${user.discordId})` : "Not connected" },
                    { label:"Role",         value: user?.role || "user" },
                    { label:"Member since", value: new Date(user?.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}) },
                  ].map(f => (
                    <div key={f.label} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(59,7,100,0.2)" }}>
                      <span style={{ fontSize:13, color:"rgba(167,139,250,0.5)", fontFamily:"var(--font-space), sans-serif" }}>{f.label}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:"#e9d5ff", fontFamily:"var(--font-space), sans-serif", textAlign:"right", maxWidth:"60%", wordBreak:"break-all" }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => signOut({ callbackUrl:"/" })} style={{ width:"100%", padding:"13px 0", borderRadius:14, border:"1px solid rgba(239,68,68,0.25)", background:"rgba(239,68,68,0.06)", cursor:"pointer", color:"#f87171", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"var(--font-space), sans-serif" }}>
                <LogOut size={15}/> Sign Out
              </button>
            </div>
          )}
        </div>
      </main>
      <style>{`@media(max-width:768px){.dash-sidebar{display:none!important}.dash-burger{display:flex!important}}`}</style>
    </div>
  );
}
