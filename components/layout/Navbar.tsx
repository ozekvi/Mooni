"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, Shield, Star } from "lucide-react";
import MoonIcon from "@/components/ui/MoonIcon";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isAdmin = session?.user?.role === "admin";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      padding: scrolled ? "10px 0" : "18px 0",
      background: scrolled ? "rgba(9,3,15,0.9)" : "transparent",
      borderBottom: scrolled ? "1px solid rgba(59,7,100,0.4)" : "1px solid transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      transition: "all 0.35s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <MoonIcon size={34} />
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontWeight: 700, fontSize: 17, letterSpacing: "0.3em", background: "linear-gradient(135deg,#c084fc,#a855f7,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MOONI</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {[["Services", "/services"], ["About", "/about"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontFamily: "var(--font-raleway), sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", color: "rgba(192,132,252,0.8)", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f3e8ff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(192,132,252,0.8)")}>
              {label}
            </Link>
          ))}
        </div>

        {/* Auth area */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {session ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 12, cursor: "pointer", background: "rgba(88,28,135,0.2)", border: "1px solid rgba(124,34,212,0.35)", color: "#e9d5ff", fontSize: 14, fontWeight: 500 }}>
                {session.user?.image
                  ? <img src={session.user.image} alt="" style={{ width: 26, height: 26, borderRadius: "50%", border: "2px solid rgba(168,85,247,0.5)" }} />
                  : <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#7c22d4,#a855f7)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{session.user?.name?.[0]?.toUpperCase() || "U"}</div>
                }
                <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user?.name}</span>
                <ChevronDown size={14} style={{ color: "rgba(167,139,250,0.6)" }} />
              </button>

              {userMenuOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 190, borderRadius: 16, background: "#100520", border: "1px solid rgba(88,28,135,0.5)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)", overflow: "hidden", zIndex: 100 }}>
                  {[
                    { href: "/dashboard", icon: <LayoutDashboard size={14} />, label: "Dashboard" },
                    ...(isAdmin ? [{ href: "/admin", icon: <Shield size={14} />, label: "Admin Panel" }] : []),
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none", fontSize: 14, color: "#e9d5ff", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,34,212,0.2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <span style={{ color: "#a855f7" }}>{item.icon}</span> {item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: "rgba(59,7,100,0.5)" }} />
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#f87171", textAlign: "left" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" style={{ padding: "9px 18px", borderRadius: 10, textDecoration: "none", color: "rgba(192,132,252,0.8)", fontSize: 14, fontWeight: 500, border: "1px solid rgba(124,34,212,0.25)", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f3e8ff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(192,132,252,0.8)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,34,212,0.25)"; }}>
                Login
              </Link>
              <Link href="/auth/signup" style={{ padding: "10px 22px", borderRadius: 12, textDecoration: "none", background: "linear-gradient(135deg,#7c22d4,#a855f7)", boxShadow: "0 0 18px rgba(168,85,247,0.35)", color: "white", fontSize: 14, fontWeight: 600 }}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="nav-burger"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#a78bfa", display: "none", padding: 4 }}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ margin: "8px 16px 0", borderRadius: 20, padding: "16px", background: "rgba(12,4,24,0.97)", border: "1px solid rgba(59,7,100,0.5)", backdropFilter: "blur(24px)" }}>
          {[["Services", "/services"], ["About", "/about"]].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              style={{ display: "block", padding: "11px 14px", borderRadius: 10, color: "#c084fc", textDecoration: "none", fontSize: 14 }}>
              {label}
            </Link>
          ))}
          <div style={{ height: 1, background: "rgba(59,7,100,0.4)", margin: "8px 0" }} />
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "11px 14px", color: "#c084fc", textDecoration: "none", fontSize: 14 }}>Dashboard</Link>
              {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "11px 14px", color: "#c084fc", textDecoration: "none", fontSize: 14 }}>Admin</Link>}
              <button onClick={() => signOut({ callbackUrl: "/" })}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 14px", background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 14 }}>
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                style={{ flex: 1, textAlign: "center", padding: "11px 0", borderRadius: 12, textDecoration: "none", border: "1px solid rgba(124,34,212,0.4)", color: "#c084fc", fontSize: 14 }}>Login</Link>
              <Link href="/auth/signup" onClick={() => setMobileOpen(false)}
                style={{ flex: 1, textAlign: "center", padding: "11px 0", borderRadius: 12, textDecoration: "none", background: "linear-gradient(135deg,#7c22d4,#a855f7)", color: "white", fontSize: 14, fontWeight: 600 }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media(max-width:768px){.nav-links{display:none!important}.nav-burger{display:flex!important}}
      `}</style>
    </nav>
  );
}
