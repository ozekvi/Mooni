"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Moon, Sun, Menu, X, LayoutDashboard, LogOut, Shield } from "lucide-react";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAdmin = session?.user?.role === "admin";

  const navBg = scrolled
    ? isDark ? "rgba(9,3,15,0.92)" : "rgba(248,245,255,0.92)"
    : "transparent";
  const borderColor = scrolled
    ? isDark ? "rgba(59,7,100,0.5)" : "rgba(216,180,254,0.5)"
    : "transparent";

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          padding: scrolled ? "10px 0" : "18px 0",
          background: navBg,
          borderBottom: `1px solid ${borderColor}`,
          backdropFilter: scrolled ? "blur(20px)" : "none",
          transition: "all 0.35s ease",
        }}
      >
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "12px",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 100 100">
              <defs>
                <radialGradient id="navMoon" cx="38%" cy="38%" r="65%">
                  <stop offset="0%" stopColor="#f3e8ff" />
                  <stop offset="60%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6b21a8" />
                </radialGradient>
              </defs>
              <circle cx="52" cy="50" r="39" fill="url(#navMoon)" />
              <circle cx="70" cy="43" r="33" fill={isDark ? "#09030f" : "#f8f5ff"} />
            </svg>
            <span style={{
              fontFamily: "var(--font-cinzel), serif",
              fontWeight: 700, fontSize: 17, letterSpacing: "0.3em",
              background: "linear-gradient(135deg, #c084fc, #a855f7)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              MOONI
            </span>
          </Link>

          {/* Desktop center links */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 28, flex: 1, justifyContent: "center" }}>
            {["Сервисы", "О нас"].map((item, i) => {
              const href = i === 0 ? "/services" : "/about";
              return (
                <Link key={item} href={href} style={{
                  fontFamily: "var(--font-raleway), sans-serif",
                  fontSize: 12, fontWeight: 600, letterSpacing: "0.15em",
                  textTransform: "uppercase", textDecoration: "none",
                  color: isDark ? "#c084fc" : "#7c22d4",
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  {item}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 10 }}>
            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px", borderRadius: "10px",
                color: isDark ? "#a78bfa" : "#7c3aed",
                display: "flex", alignItems: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(124,34,212,0.2)" : "rgba(167,139,250,0.15)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
              title={isDark ? "Светлая тема" : "Тёмная тема"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {session ? (
              <div style={{ position: "relative" }} ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 14px", borderRadius: "12px", cursor: "pointer",
                    background: isDark ? "rgba(88,28,135,0.2)" : "rgba(233,213,255,0.5)",
                    border: `1px solid ${isDark ? "rgba(124,34,212,0.4)" : "rgba(167,139,250,0.5)"}`,
                    color: isDark ? "#e9d5ff" : "#581c87",
                    fontSize: 13, fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                      color: "white", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 10, fontWeight: 700,
                    }}>
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {session.user?.name}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ opacity: 0.7, transition: "transform 0.2s", transform: userMenuOpen ? "rotate(180deg)" : "" }}>
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    width: 190, borderRadius: 14,
                    background: isDark ? "rgba(15,5,26,0.98)" : "white",
                    border: `1px solid ${isDark ? "rgba(59,7,100,0.6)" : "rgba(216,180,254,0.6)"}`,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                    overflow: "hidden",
                    animation: "fadeInUp 0.15s ease-out",
                  }}>
                    {[
                      { href: "/dashboard", icon: <LayoutDashboard size={14} />, label: "Дашборд" },
                      ...(isAdmin ? [{ href: "/admin", icon: <Shield size={14} />, label: "Админ панель" }] : []),
                    ].map(item => (
                      <Link key={item.href} href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "11px 16px", textDecoration: "none",
                          fontSize: 13, color: isDark ? "#e9d5ff" : "#3b0764",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(124,34,212,0.2)" : "rgba(233,213,255,0.5)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <div style={{ height: 1, background: isDark ? "rgba(59,7,100,0.5)" : "rgba(216,180,254,0.5)" }} />
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                        padding: "11px 16px", background: "none", border: "none",
                        cursor: "pointer", fontSize: 13, color: "#f87171", textAlign: "left",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut size={14} /> Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" style={{
                  padding: "8px 16px", borderRadius: 10, textDecoration: "none",
                  fontSize: 13, color: isDark ? "#c084fc" : "#7c22d4", fontWeight: 500,
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Войти
                </Link>
                <Link href="/auth/signup" style={{
                  padding: "9px 18px", borderRadius: 12, textDecoration: "none",
                  background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                  boxShadow: "0 0 15px rgba(168,85,247,0.35)",
                  color: "white", fontSize: 13, fontWeight: 600,
                  transition: "box-shadow 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 25px rgba(168,85,247,0.6)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 15px rgba(168,85,247,0.35)")}
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden" style={{ alignItems: "center", gap: 8 }}>
            <button
              onClick={onToggleTheme}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px", color: isDark ? "#a78bfa" : "#7c3aed",
              }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px", color: isDark ? "#a78bfa" : "#7c22d4",
                display: "flex",
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            margin: "8px 12px 0",
            borderRadius: 16, padding: 12,
            background: isDark ? "rgba(15,5,26,0.98)" : "rgba(248,245,255,0.98)",
            border: `1px solid ${isDark ? "rgba(59,7,100,0.5)" : "rgba(216,180,254,0.5)"}`,
            backdropFilter: "blur(20px)",
            animation: "fadeInUp 0.2s ease-out",
          }}>
            <nav>
              {[
                { href: "/services", label: "Сервисы" },
                { href: "/about", label: "О нас" },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block", padding: "10px 14px", borderRadius: 10,
                    color: isDark ? "#c084fc" : "#7c22d4", textDecoration: "none",
                    fontSize: 14, fontWeight: 500, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(124,34,212,0.15)" : "rgba(216,180,254,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div style={{ height: 1, background: isDark ? "rgba(59,7,100,0.5)" : "rgba(216,180,254,0.4)", margin: "8px 0" }} />

            {session ? (
              <div style={{ padding: "4px 0" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", marginBottom: 4,
                }}>
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                      color: "white", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 13, fontWeight: 700,
                    }}>
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#e9d5ff" : "#3b0764" }}>
                      {session.user?.name}
                    </div>
                    <div style={{ fontSize: 11, color: isDark ? "#6d28d9" : "#a78bfa" }}>
                      {session.user?.email}
                    </div>
                  </div>
                </div>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: 10,
                    color: isDark ? "#c084fc" : "#7c22d4", textDecoration: "none", fontSize: 14,
                  }}>
                  <LayoutDashboard size={16} /> Дашборд
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 14px", borderRadius: 10,
                      color: "#c084fc", textDecoration: "none", fontSize: 14,
                    }}>
                    <Shield size={16} /> Админ панель
                  </Link>
                )}
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "10px 14px", borderRadius: 10,
                    background: "none", border: "none", cursor: "pointer",
                    color: "#f87171", fontSize: 14, textAlign: "left",
                  }}>
                  <LogOut size={16} /> Выйти
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, padding: "4px 0" }}>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1, textAlign: "center", padding: "10px 0",
                    borderRadius: 12, textDecoration: "none",
                    border: `1px solid ${isDark ? "rgba(124,34,212,0.5)" : "rgba(167,139,250,0.5)"}`,
                    color: isDark ? "#c084fc" : "#7c22d4", fontSize: 14, fontWeight: 500,
                  }}>
                  Войти
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1, textAlign: "center", padding: "10px 0",
                    borderRadius: 12, textDecoration: "none",
                    background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                    color: "white", fontSize: 14, fontWeight: 600,
                  }}>
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
