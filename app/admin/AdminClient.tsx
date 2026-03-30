"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Shield, Package, Users, ShoppingBag, Plus, Trash2, LogOut, CheckCircle, Clock, XCircle, LayoutDashboard, X, TrendingUp, Ban, UserCheck, Crown, Home, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import MoonImage from "@/components/ui/MoonImage";

const statusCfg: Record<string,any> = {
  completed:{ icon:<CheckCircle size={13}/>, color:"#34d399", bg:"rgba(52,211,153,0.1)", label:"Completed" },
  pending:  { icon:<Clock size={13}/>,       color:"#fbbf24", bg:"rgba(251,191,36,0.1)",  label:"Pending" },
  expired:  { icon:<XCircle size={13}/>,     color:"#f87171", bg:"rgba(248,113,113,0.1)", label:"Expired" },
  failed:   { icon:<XCircle size={13}/>,     color:"#f87171", bg:"rgba(248,113,113,0.1)", label:"Failed" },
};

const TABS = [
  { id:"overview",  icon:<LayoutDashboard size={17}/>, label:"Overview" },
  { id:"products",  icon:<Package size={17}/>,         label:"Products" },
  { id:"orders",    icon:<ShoppingBag size={17}/>,     label:"Orders" },
  { id:"users",     icon:<Users size={17}/>,           label:"Users" },
];

const CATS = ["leveling","gems","alliance","pvp","defense","vip","other"];

export default function AdminClient({ products: init, orders, users: initUsers }: any) {
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState(init);
  const [users, setUsers] = useState(initUsers);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:"", description:"", price:"", currency:"usd", category:"leveling", image:"" });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string|null>(null);
  const [actionUser, setActionUser] = useState<string|null>(null);
  const [formErr, setFormErr] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const revenue = orders.filter((o:any)=>o.status==="completed").reduce((s:number,o:any)=>s+o.amount,0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setFormErr(""); setCreating(true);
    try {
      const res = await fetch("/api/admin/products", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...form, price:parseFloat(form.price)}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts([data,...products]); setModal(false); setForm({name:"",description:"",price:"",currency:"usd",category:"leveling",image:""});
    } catch(e:any) { setFormErr(e.message); }
    finally { setCreating(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if(!confirm("Deactivate this product?")) return;
    setDeleting(id);
    await fetch("/api/admin/products",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    setProducts(products.map((p:any)=>p.id===id?{...p,active:false}:p));
    setDeleting(null);
  };

  const handleUserAction = async (userId: string, action: string) => {
    setActionUser(userId+action);
    try {
      if (action === "delete") {
        if (!confirm("Permanently delete this user and all their data?")) return;
        await fetch("/api/admin/users",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId})});
        setUsers(users.filter((u:any)=>u.id!==userId));
      } else {
        const res = await fetch("/api/admin/users",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId,action})});
        const data = await res.json();
        if(res.ok) setUsers(users.map((u:any)=>u.id===userId?{...u,role:data.user.role}:u));
      }
    } finally { setActionUser(null); }
  };

  const SidebarContent = () => (
    <>
      <div style={{ padding:"24px 20px 18px", borderBottom:"1px solid rgba(88,28,135,0.25)", display:"flex", alignItems:"center", gap:10 }}>
        <MoonImage size={34} />
        <div>
          <span style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:800, fontSize:15, letterSpacing:"0.2em", background:"linear-gradient(135deg,#e9d5ff,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>MOONI</span>
          <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
            <Shield size={10} style={{ color:"#c084fc" }} />
            <span style={{ fontSize:10, color:"rgba(192,132,252,0.7)", letterSpacing:"0.12em", fontFamily:"var(--font-space), sans-serif" }}>ADMIN</span>
          </div>
        </div>
      </div>
      <nav style={{ padding:"12px 12px", flex:1 }}>
        {TABS.map(t => {
          const active = tab===t.id;
          return (
            <button key={t.id} onClick={()=>{setTab(t.id);setSidebarOpen(false);}}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14, border:"none", cursor:"pointer", marginBottom:4, transition:"all 0.2s", textAlign:"left", fontFamily:"var(--font-space), sans-serif", fontSize:14, fontWeight:600,
                background: active?"linear-gradient(135deg,rgba(91,33,182,0.55),rgba(147,51,234,0.35))":"transparent",
                color: active?"#f0e8ff":"rgba(196,168,255,0.6)",
                borderColor: active?"rgba(168,85,247,0.22)":"transparent",
              }}>
              <span style={{ color:active?"#c084fc":"rgba(167,139,250,0.45)" }}>{t.icon}</span>
              {t.label}
              {active && <ChevronRight size={14} style={{ marginLeft:"auto", color:"rgba(192,132,252,0.5)" }} />}
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"12px 12px 20px", borderTop:"1px solid rgba(88,28,135,0.2)" }}>
        <Link href="/dashboard" style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:12, color:"rgba(167,139,250,0.6)", textDecoration:"none", fontSize:13, fontFamily:"var(--font-space), sans-serif", marginBottom:4 }}>
          <LayoutDashboard size={14}/> Dashboard
        </Link>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:12, color:"rgba(167,139,250,0.6)", textDecoration:"none", fontSize:13, fontFamily:"var(--font-space), sans-serif", marginBottom:4 }}>
          <Home size={14}/> Home
        </Link>
        <button onClick={()=>signOut({callbackUrl:"/"})} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", borderRadius:12, background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#f87171", textAlign:"left", fontFamily:"var(--font-space), sans-serif" }}>
          <LogOut size={14}/> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"#07020f", color:"#f0e8ff", fontFamily:"var(--font-plus), sans-serif" }}>

      {/* Desktop sidebar */}
      <aside className="admin-sidebar" style={{ width:248, minHeight:"100vh", display:"flex", flexDirection:"column", borderRight:"1px solid rgba(88,28,135,0.2)", background:"rgba(10,3,22,0.95)", backdropFilter:"blur(24px)", position:"sticky", top:0, height:"100vh" }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:200 }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.65)" }} onClick={()=>setSidebarOpen(false)} />
          <aside style={{ position:"absolute", left:0, top:0, bottom:0, width:260, display:"flex", flexDirection:"column", background:"rgba(10,3,22,0.99)", borderRight:"1px solid rgba(88,28,135,0.3)" }}>
            <button onClick={()=>setSidebarOpen(false)} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", color:"#a78bfa", fontSize:22 }}>✕</button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"auto", minWidth:0 }}>
        <header style={{ position:"sticky", top:0, zIndex:50, padding:"0 24px", height:62, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(7,2,15,0.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(88,28,135,0.18)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <button className="admin-burger" onClick={()=>setSidebarOpen(true)} style={{ display:"none", background:"none", border:"none", cursor:"pointer", color:"#a78bfa" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:18, color:"#f0e8ff", textTransform:"capitalize" }}>{TABS.find(t=>t.id===tab)?.label}</h1>
          </div>
          {tab==="products" && (
            <button onClick={()=>setModal(true)} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:100, background:"linear-gradient(135deg,#5b21b6,#9333ea)", border:"none", cursor:"pointer", color:"white", fontSize:13, fontWeight:700, fontFamily:"var(--font-space), sans-serif", boxShadow:"0 0 16px rgba(88,28,135,0.4)" }}>
              <Plus size={15}/> New Product
            </button>
          )}
        </header>

        <div style={{ flex:1, padding:"24px" }}>

          {/* OVERVIEW */}
          {tab==="overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20, animation:"fadeInUp 0.4s ease-out" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16 }}>
                {[
                  { label:"Total Revenue",    value:formatPrice(revenue), icon:<TrendingUp size={20}/>, color:"#34d399" },
                  { label:"Total Orders",     value:orders.length,        icon:<ShoppingBag size={20}/>,color:"#a855f7" },
                  { label:"Active Products",  value:products.filter((p:any)=>p.active).length, icon:<Package size={20}/>, color:"#c084fc" },
                  { label:"Total Users",      value:users.length,         icon:<Users size={20}/>,      color:"#fbbf24" },
                ].map(s => (
                  <div key={s.label} style={{ padding:"22px 20px", borderRadius:20, background:"rgba(14,5,30,0.8)", border:"1px solid rgba(88,28,135,0.22)" }}>
                    <div style={{ color:s.color, marginBottom:14 }}>{s.icon}</div>
                    <p style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:26, color:"#f0e8ff", margin:"0 0 4px" }}>{s.value}</p>
                    <p style={{ fontSize:12, color:"rgba(167,139,250,0.5)", fontFamily:"var(--font-space), sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent orders table */}
              <div style={{ borderRadius:20, overflow:"hidden", border:"1px solid rgba(88,28,135,0.22)", background:"rgba(12,4,26,0.8)" }}>
                <div style={{ padding:"18px 22px 14px", borderBottom:"1px solid rgba(88,28,135,0.18)", display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:"#a855f7", boxShadow:"0 0 8px #a855f7" }} />
                  <h3 style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:15, color:"#f0e8ff" }}>Recent Orders</h3>
                </div>
                {orders.slice(0,6).map((o:any, i:number) => {
                  const st = statusCfg[o.status]||statusCfg.pending;
                  return (
                    <div key={o.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 22px", borderBottom:i<5?"1px solid rgba(59,7,100,0.18)":"none", gap:12, flexWrap:"wrap" }}>
                      <div>
                        <p style={{ fontSize:14, fontWeight:600, color:"#e9d5ff", fontFamily:"var(--font-space), sans-serif", marginBottom:2 }}>{o.product?.name}</p>
                        <p style={{ fontSize:11, color:"rgba(167,139,250,0.4)" }}>{o.user?.email}</p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:100, background:st.bg, color:st.color, fontSize:11, fontWeight:600 }}>{st.icon}{st.label}</span>
                        <span style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:14, color:"#c084fc" }}>{formatPrice(o.amount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab==="products" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14, animation:"fadeInUp 0.4s ease-out" }}>
              {products.map((p:any) => (
                <div key={p.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, padding:"18px 22px", borderRadius:18, background:"rgba(12,4,26,0.8)", border:"1px solid rgba(88,28,135,0.22)", opacity:p.active?1:0.5, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <h3 style={{ fontFamily:"var(--font-space), sans-serif", fontWeight:700, fontSize:15, color:"#f0e8ff" }}>{p.name}</h3>
                      {!p.active && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:100, background:"rgba(248,113,113,0.15)", color:"#f87171", fontWeight:600 }}>INACTIVE</span>}
                      <span style={{ fontSize:10, padding:"2px 8px", borderRadius:100, background:"rgba(88,28,135,0.2)", color:"#a78bfa", textTransform:"capitalize" }}>{p.category}</span>
                    </div>
                    <p style={{ fontSize:13, color:"rgba(167,139,250,0.5)", marginBottom:0 }}>{p.description}</p>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <span style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:18, color:"#c084fc" }}>{formatPrice(p.price,p.currency)}</span>
                    {p.active && <button onClick={()=>handleDeleteProduct(p.id)} disabled={deleting===p.id} style={{ padding:"8px 10px", borderRadius:10, border:"1px solid rgba(248,113,113,0.2)", background:"rgba(248,113,113,0.07)", cursor:"pointer", color:"#f87171", display:"flex", alignItems:"center" }}>
                      <Trash2 size={15}/>
                    </button>}
                  </div>
                </div>
              ))}
              {products.length===0 && <p style={{ textAlign:"center", padding:"60px 0", color:"rgba(107,33,168,0.5)", fontFamily:"var(--font-space), sans-serif" }}>No products yet.</p>}
            </div>
          )}

          {/* ORDERS */}
          {tab==="orders" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12, animation:"fadeInUp 0.4s ease-out" }}>
              {orders.map((o:any) => {
                const st = statusCfg[o.status]||statusCfg.pending;
                return (
                  <div key={o.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 22px", borderRadius:18, background:"rgba(12,4,26,0.8)", border:"1px solid rgba(88,28,135,0.22)", gap:16, flexWrap:"wrap" }}>
                    <div>
                      <p style={{ fontSize:14, fontWeight:600, color:"#e9d5ff", fontFamily:"var(--font-space), sans-serif", marginBottom:3 }}>{o.product?.name}</p>
                      <p style={{ fontSize:12, color:"rgba(167,139,250,0.4)" }}>{o.user?.name} · {o.user?.email}</p>
                      <p style={{ fontSize:11, color:"rgba(107,33,168,0.5)", marginTop:2 }}>{new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:100, background:st.bg, color:st.color, fontSize:12, fontWeight:600 }}>{st.icon}{st.label}</span>
                      <span style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:15, color:"#c084fc" }}>{formatPrice(o.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* USERS */}
          {tab==="users" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12, animation:"fadeInUp 0.4s ease-out" }}>
              {users.map((u:any) => {
                const isBanned = u.role==="banned";
                const isUserAdmin = u.role==="admin";
                return (
                  <div key={u.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 22px", borderRadius:18, background: isBanned?"rgba(30,8,8,0.8)":"rgba(12,4,26,0.8)", border:`1px solid ${isBanned?"rgba(248,113,113,0.2)":"rgba(88,28,135,0.22)"}`, gap:16, flexWrap:"wrap" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      {u.image
                        ? <img src={u.image} alt="" style={{ width:42, height:42, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(168,85,247,0.3)" }} />
                        : <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#5b21b6,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"white", flexShrink:0 }}>{u.name?.[0]?.toUpperCase()||"U"}</div>
                      }
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                          <p style={{ fontSize:14, fontWeight:700, color: isBanned?"#f87171":"#e9d5ff", fontFamily:"var(--font-space), sans-serif" }}>{u.name||"Unknown"}</p>
                          {isUserAdmin && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:100, background:"rgba(192,132,252,0.15)", color:"#c084fc", fontWeight:700 }}>ADMIN</span>}
                          {isBanned && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:100, background:"rgba(248,113,113,0.15)", color:"#f87171", fontWeight:700 }}>BANNED</span>}
                          {u.discordId && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:100, background:"rgba(88,101,242,0.15)", color:"#818cf8", fontWeight:600 }}>Discord</span>}
                        </div>
                        <p style={{ fontSize:12, color:"rgba(167,139,250,0.45)" }}>{u.email||"No email"}</p>
                        <p style={{ fontSize:11, color:"rgba(107,33,168,0.45)", marginTop:2 }}>Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {!isBanned ? (
                        <button onClick={()=>handleUserAction(u.id,"ban")} disabled={actionUser===u.id+"ban"}
                          style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:"1px solid rgba(248,113,113,0.25)", background:"rgba(248,113,113,0.08)", cursor:"pointer", color:"#f87171", fontSize:12, fontWeight:600, fontFamily:"var(--font-space), sans-serif" }}>
                          <Ban size={13}/> Ban
                        </button>
                      ) : (
                        <button onClick={()=>handleUserAction(u.id,"unban")} disabled={actionUser===u.id+"unban"}
                          style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:"1px solid rgba(52,211,153,0.25)", background:"rgba(52,211,153,0.08)", cursor:"pointer", color:"#34d399", fontSize:12, fontWeight:600, fontFamily:"var(--font-space), sans-serif" }}>
                          <UserCheck size={13}/> Unban
                        </button>
                      )}
                      {!isUserAdmin ? (
                        <button onClick={()=>handleUserAction(u.id,"makeAdmin")} disabled={actionUser===u.id+"makeAdmin"}
                          style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:"1px solid rgba(192,132,252,0.25)", background:"rgba(192,132,252,0.08)", cursor:"pointer", color:"#c084fc", fontSize:12, fontWeight:600, fontFamily:"var(--font-space), sans-serif" }}>
                          <Crown size={13}/> Make Admin
                        </button>
                      ) : (
                        <button onClick={()=>handleUserAction(u.id,"removeAdmin")} disabled={actionUser===u.id+"removeAdmin"}
                          style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:"1px solid rgba(251,191,36,0.25)", background:"rgba(251,191,36,0.08)", cursor:"pointer", color:"#fbbf24", fontSize:12, fontWeight:600, fontFamily:"var(--font-space), sans-serif" }}>
                          <Crown size={13}/> Remove Admin
                        </button>
                      )}
                      <button onClick={()=>handleUserAction(u.id,"delete")} disabled={actionUser===u.id+"delete"}
                        style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", borderRadius:10, border:"1px solid rgba(248,113,113,0.2)", background:"rgba(248,113,113,0.06)", cursor:"pointer", color:"#f87171", fontSize:12 }}>
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Create Product Modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)" }}>
          <div style={{ width:"100%", maxWidth:500, borderRadius:24, overflow:"hidden", background:"rgba(10,3,22,0.99)", border:"1px solid rgba(124,34,212,0.35)", boxShadow:"0 0 80px rgba(88,28,135,0.3)" }}>
            <div style={{ height:2, background:"linear-gradient(90deg,transparent,#7c22d4,#c084fc,#7c22d4,transparent)" }} />
            <div style={{ padding:"28px 28px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                <h2 style={{ fontFamily:"var(--font-cinzel), serif", fontWeight:700, fontSize:18, color:"#f0e8ff" }}>Create Product</h2>
                <button onClick={()=>setModal(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(167,139,250,0.6)", fontSize:22 }}><X size={20}/></button>
              </div>
              {formErr && <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.25)", color:"#fca5a5", fontSize:13, marginBottom:16 }}>{formErr}</div>}
              <form onSubmit={handleCreate} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { label:"Product Name", field:"name", type:"text", ph:"e.g. Fog exploring Package" },
                  { label:"Price (USD)", field:"price", type:"number", ph:"29.99" },
                  { label:"Image URL (optional)", field:"image", type:"url", ph:"https://..." },
                ].map(({label,field,type,ph}) => (
                  <div key={field}>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(167,139,250,0.6)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6, fontFamily:"var(--font-space), sans-serif" }}>{label}</label>
                    <input type={type} placeholder={ph} value={(form as any)[field]} onChange={e=>setForm({...form,[field]:e.target.value})} required={field!=="image"} step={field==="price"?"0.01":undefined} min={field==="price"?"0.01":undefined}
                      style={{ width:"100%", padding:"11px 14px", borderRadius:12, background:"rgba(30,8,55,0.5)", border:"1.5px solid rgba(88,28,135,0.4)", color:"#f0e8ff", fontSize:14, outline:"none" }} />
                  </div>
                ))}
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(167,139,250,0.6)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6, fontFamily:"var(--font-space), sans-serif" }}>Category</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                    style={{ width:"100%", padding:"11px 14px", borderRadius:12, background:"rgba(30,8,55,0.5)", border:"1.5px solid rgba(88,28,135,0.4)", color:"#f0e8ff", fontSize:14, outline:"none" }}>
                    {CATS.map(c=><option key={c} value={c} style={{ background:"#0a0316" }}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(167,139,250,0.6)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6, fontFamily:"var(--font-space), sans-serif" }}>Description</label>
                  <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required rows={3} placeholder="What does this service include?"
                    style={{ width:"100%", padding:"11px 14px", borderRadius:12, background:"rgba(30,8,55,0.5)", border:"1.5px solid rgba(88,28,135,0.4)", color:"#f0e8ff", fontSize:14, outline:"none", resize:"vertical" }} />
                </div>
                <div style={{ display:"flex", gap:10, marginTop:6 }}>
                  <button type="button" onClick={()=>setModal(false)} style={{ flex:1, padding:"13px 0", borderRadius:12, border:"1px solid rgba(88,28,135,0.4)", background:"none", cursor:"pointer", color:"rgba(167,139,250,0.7)", fontSize:14, fontWeight:600, fontFamily:"var(--font-space), sans-serif" }}>Cancel</button>
                  <button type="submit" disabled={creating} style={{ flex:1, padding:"13px 0", borderRadius:12, border:"none", cursor:creating?"not-allowed":"pointer", background:"linear-gradient(135deg,#5b21b6,#9333ea)", color:"white", fontSize:14, fontWeight:700, fontFamily:"var(--font-space), sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 0 20px rgba(88,28,135,0.4)" }}>
                    {creating ? <><span style={{ width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin 1s linear infinite",display:"inline-block" }}/> Creating…</> : <><Plus size={15}/> Create</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`@media(max-width:768px){.admin-sidebar{display:none!important}.admin-burger{display:flex!important}}`}</style>
    </div>
  );
}
