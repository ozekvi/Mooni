"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, Shield } from "lucide-react";
import MoonImage from "@/components/ui/MoonImage";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isAdmin = session?.user?.role === "admin";
  const isBanned = session?.user?.role === "banned";

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? "10px 0" : "16px 0", background: scrolled ? "rgba(7,2,15,0.88)" : "transparent", borderBottom: scrolled ? "1px solid rgba(88,28,135,0.25)" : "none", backdropFilter: scrolled ? "blur(28px)" : "none", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <MoonImage size={36} />
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.25em", background: "linear-gradient(135deg, #e9d5ff, #c084fc, #9333ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MOONI</span>
        </Link>

        {/* Desktop */}
        <div className="nav-d" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[["Services", "/services"], ["About", "/about"]].map(([l, h]) => (
            <Link key={h} href={h} style={{ padding: "8px 18px", borderRadius: 100, fontFamily: "var(--font-space), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textDecoration: "none", color: "rgba(196,168,255,0.75)", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f0e8ff"; (e.currentTarget as HTMLElement).style.background = "rgba(88,28,135,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(196,168,255,0.75)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              {l}
            </Link>
          ))}
        </div>

        <div className="nav-d" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {session ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setUserMenu(!userMenu)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 100, cursor: "pointer", background: "rgba(88,28,135,0.18)", border: "1px solid rgba(168,85,247,0.25)", color: "#e9d5ff", fontSize: 14, fontWeight: 500, fontFamily: "var(--font-space), sans-serif", transition: "all 0.2s" }}>
                {session.user?.image
                  ? <img src={session.user.image} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid rgba(168,85,247,0.5)" }} />
                  : <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #6b21a8, #a855f7)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{session.user?.name?.[0]?.toUpperCase() || "U"}</div>
                }
                <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user?.name}</span>
                {isAdmin && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 100, background: "rgba(192,132,252,0.2)", color: "#c084fc", letterSpacing: "0.05em" }}>ADMIN</span>}
                <ChevronDown size={13} style={{ color: "rgba(167,139,250,0.6)" }} />
              </button>

              {userMenu && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 200, borderRadius: 18, background: "rgba(10,3,22,0.97)", border: "1px solid rgba(88,28,135,0.4)", boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(192,132,252,0.05)", overflow: "hidden", backdropFilter: "blur(24px)" }}>
                  <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid rgba(59,7,100,0.4)" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#e9d5ff", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user?.name}</p>
                    <p style={{ fontSize: 11, color: "rgba(167,139,250,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user?.email}</p>
                  </div>
                  {[
                    { href: "/dashboard", icon: <LayoutDashboard size={14} />, label: "Dashboard" },
                    ...(isAdmin ? [{ href: "/admin", icon: <Shield size={14} />, label: "Admin Panel" }] : []),
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setUserMenu(false)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", textDecoration: "none", fontSize: 14, color: "rgba(221,200,255,0.85)", transition: "background 0.15s", fontFamily: "var(--font-space), sans-serif" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,34,212,0.18)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <span style={{ color: "#a855f7" }}>{item.icon}</span>{item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: "rgba(59,7,100,0.4)" }} />
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setUserMenu(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#f87171", textAlign: "left", fontFamily: "var(--font-space), sans-serif" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" style={{ padding: "9px 20px", borderRadius: 100, textDecoration: "none", color: "rgba(196,168,255,0.8)", fontSize: 14, fontWeight: 600, border: "1px solid rgba(88,28,135,0.3)", fontFamily: "var(--font-space), sans-serif", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.5)"; (e.currentTarget as HTMLElement).style.color = "#f0e8ff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(88,28,135,0.3)"; (e.currentTarget as HTMLElement).style.color = "rgba(196,168,255,0.8)"; }}>
                Login
              </Link>
              <Link href="/auth/signup" style={{ padding: "10px 22px", borderRadius: 100, textDecoration: "none", background: "linear-gradient(135deg, #5b21b6, #9333ea)", boxShadow: "0 0 20px rgba(147,51,234,0.4)", color: "white", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-space), sans-serif" }}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobile(!mobile)} className="nav-m" style={{ background: "none", border: "none", cursor: "pointer", color: "#a78bfa", display: "none", padding: 6 }}>
          {mobile ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobile && (
        <div style={{ margin: "10px 16px 0", borderRadius: 20, padding: "16px 12px", background: "rgba(10,3,22,0.97)", border: "1px solid rgba(59,7,100,0.45)", backdropFilter: "blur(24px)" }}>
          {[["Services", "/services"], ["About", "/about"]].map(([l, h]) => (
            <Link key={h} href={h} onClick={() => setMobile(false)}
              style={{ display: "block", padding: "11px 14px", borderRadius: 12, color: "rgba(196,168,255,0.85)", textDecoration: "none", fontSize: 14, fontFamily: "var(--font-space), sans-serif", marginBottom: 2 }}>
              {l}
            </Link>
          ))}
          <div style={{ height: 1, background: "rgba(59,7,100,0.35)", margin: "8px 0" }} />
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMobile(false)} style={{ display: "block", padding: "11px 14px", borderRadius: 12, color: "rgba(196,168,255,0.85)", textDecoration: "none", fontSize: 14, fontFamily: "var(--font-space), sans-serif" }}>Dashboard</Link>
              {isAdmin && <Link href="/admin" onClick={() => setMobile(false)} style={{ display: "block", padding: "11px 14px", borderRadius: 12, color: "rgba(196,168,255,0.85)", textDecoration: "none", fontSize: 14, fontFamily: "var(--font-space), sans-serif" }}>Admin</Link>}
              <button onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 14px", background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 14, borderRadius: 12, fontFamily: "var(--font-space), sans-serif" }}>Sign Out</button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Link href="/auth/login" onClick={() => setMobile(false)} style={{ flex: 1, textAlign: "center", padding: "11px 0", borderRadius: 12, textDecoration: "none", border: "1px solid rgba(88,28,135,0.4)", color: "#c084fc", fontSize: 14, fontFamily: "var(--font-space), sans-serif" }}>Login</Link>
              <Link href="/auth/signup" onClick={() => setMobile(false)} style={{ flex: 1, textAlign: "center", padding: "11px 0", borderRadius: 12, textDecoration: "none", background: "linear-gradient(135deg, #5b21b6, #9333ea)", color: "white", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-space), sans-serif" }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`@media(max-width:768px){.nav-d{display:none!important}.nav-m{display:flex!important}}`}</style>
    </nav>
  );
}
