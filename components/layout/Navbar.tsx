"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Moon, Sun, Menu, X, ChevronDown, LayoutDashboard, LogOut, Shield } from "lucide-react";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isAdmin = session?.user?.role === "admin";

  const navBg = scrolled
    ? isDark ? "rgba(9,3,15,0.85)" : "rgba(248,245,255,0.85)"
    : "transparent";
  const borderColor = scrolled
    ? isDark ? "rgba(59,7,100,0.5)" : "rgba(216,180,254,0.5)"
    : "transparent";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      padding: scrolled ? "12px 0" : "20px 0",
      background: navBg,
      borderBottom: `1px solid ${borderColor}`,
      backdropFilter: scrolled ? "blur(20px)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="30" height="30" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="navMoon" cx="38%" cy="38%" r="65%">
                <stop offset="0%" stopColor="#f3e8ff" />
                <stop offset="60%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6b21a8" />
              </radialGradient>
            </defs>
            <circle cx="52" cy="50" r="39" fill="url(#navMoon)" filter="drop-shadow(0 0 8px rgba(168,85,247,0.8))" />
            <circle cx="70" cy="43" r="33" fill={isDark ? "#09030f" : "#f8f5ff"} />
          </svg>
          <span style={{
            fontFamily: "var(--font-cinzel), serif",
            fontWeight: 700, fontSize: 18, letterSpacing: "0.3em",
            background: "linear-gradient(135deg, #c084fc, #a855f7, #7c3aed)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            MOONI
          </span>
        </Link>

        {/* Desktop center links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-desktop">
          {["Services", "About"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} style={{
              fontFamily: "var(--font-raleway), sans-serif",
              fontSize: 13, fontWeight: 500, letterSpacing: "0.15em",
              textTransform: "uppercase", textDecoration: "none",
              color: isDark ? "#c084fc" : "#7c22d4",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="nav-desktop">
          {/* Theme toggle */}
          <button onClick={onToggleTheme} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 8, borderRadius: 10, color: isDark ? "#a78bfa" : "#7c3aed",
            display: "flex", alignItems: "center",
          }}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {session ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 16px", borderRadius: 12, cursor: "pointer",
                  background: isDark ? "rgba(88,28,135,0.2)" : "rgba(233,213,255,0.5)",
                  border: `1px solid ${isDark ? "rgba(124,34,212,0.4)" : "rgba(167,139,250,0.5)"}`,
                  color: isDark ? "#e9d5ff" : "#581c87",
                  fontSize: 14, fontWeight: 500,
                }}
              >
                {session.user?.image
                  ? <img src={session.user.image} alt="" style={{ width: 24, height: 24, borderRadius: "50%" }} />
                  : <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#7c22d4", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                }
                <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user?.name}</span>
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)",
                  width: 180, borderRadius: 14,
                  background: isDark ? "#150825" : "white",
                  border: `1px solid ${isDark ? "rgba(59,7,100,0.6)" : "rgba(216,180,254,0.6)"}`,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                }}>
                  {[
                    { href: "/dashboard", icon: <LayoutDashboard size={14} />, label: "Dashboard" },
                    ...(isAdmin ? [{ href: "/admin", icon: <Shield size={14} />, label: "Admin Panel" }] : []),
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 16px", textDecoration: "none", fontSize: 14,
                        color: isDark ? "#e9d5ff" : "#3b0764",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(124,34,212,0.2)" : "rgba(233,213,255,0.5)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: isDark ? "rgba(59,7,100,0.5)" : "rgba(216,180,254,0.5)" }} />
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%",
                      padding: "12px 16px", background: "none", border: "none",
                      cursor: "pointer", fontSize: 14, color: "#f87171", textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" style={{
                padding: "8px 16px", borderRadius: 10, textDecoration: "none", fontSize: 14,
                color: isDark ? "#c084fc" : "#7c22d4", fontWeight: 500,
              }}>
                Login
              </Link>
              <Link href="/auth/signup" style={{
                padding: "10px 20px", borderRadius: 12, textDecoration: "none",
                background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                boxShadow: "0 0 20px rgba(168,85,247,0.4)",
                color: "white", fontSize: 14, fontWeight: 600, letterSpacing: "0.05em",
              }}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: isDark ? "#a78bfa" : "#7c22d4", padding: 4,
            display: "none",
          }}
          className="nav-mobile"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          margin: "8px 16px 0",
          borderRadius: 20, padding: 16,
          background: isDark ? "rgba(15,5,26,0.97)" : "rgba(248,245,255,0.97)",
          border: `1px solid ${isDark ? "rgba(59,7,100,0.5)" : "rgba(216,180,254,0.5)"}`,
          backdropFilter: "blur(20px)",
        }}>
          {["Services", "About"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setMobileOpen(false)}
              style={{
                display: "block", padding: "10px 12px", borderRadius: 10,
                color: isDark ? "#c084fc" : "#7c22d4", textDecoration: "none", fontSize: 14,
              }}>
              {item}
            </Link>
          ))}
          <div style={{ height: 1, background: isDark ? "rgba(59,7,100,0.5)" : "rgba(216,180,254,0.4)", margin: "8px 0" }} />
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "10px 12px", color: isDark ? "#c084fc" : "#7c22d4", textDecoration: "none", fontSize: 14 }}>
                Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 14 }}>
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                style={{
                  flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 12, textDecoration: "none",
                  border: `1px solid ${isDark ? "rgba(124,34,212,0.5)" : "rgba(167,139,250,0.5)"}`,
                  color: isDark ? "#c084fc" : "#7c22d4", fontSize: 14,
                }}>
                Login
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileOpen(false)}
                style={{
                  flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 12, textDecoration: "none",
                  background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                  color: "white", fontSize: 14, fontWeight: 600,
                }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
