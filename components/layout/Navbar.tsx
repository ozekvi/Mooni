"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Moon, Sun, Menu, X, ChevronDown, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isAdmin = session?.user?.role === "admin";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "py-3 backdrop-blur-xl border-b"
          : "py-5",
        theme === "dark"
          ? scrolled
            ? "bg-dark-200/80 border-primary-900/50"
            : "bg-transparent"
          : scrolled
          ? "bg-white/80 border-purple-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <svg width="32" height="32" viewBox="0 0 100 100" className="group-hover:scale-110 transition-transform duration-300">
              <defs>
                <radialGradient id="navMoon" cx="38%" cy="38%" r="65%">
                  <stop offset="0%" stopColor="#f3e8ff" />
                  <stop offset="60%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6b21a8" />
                </radialGradient>
              </defs>
              <circle cx="52" cy="50" r="39" fill="url(#navMoon)" filter="drop-shadow(0 0 8px rgba(168,85,247,0.8))" />
              <circle cx="70" cy="43" r="33" fill={theme === "dark" ? "#09030f" : "#f8f5ff"} />
            </svg>
          </div>
          <span
            className="font-display font-bold text-xl tracking-widest"
            style={{
              background: "linear-gradient(135deg, #c084fc, #a855f7, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MOONI
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {["Services", "About"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className={cn(
                "font-body text-sm font-medium tracking-wider uppercase transition-colors duration-200",
                theme === "dark"
                  ? "text-purple-300 hover:text-purple-100"
                  : "text-purple-700 hover:text-purple-900"
              )}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              theme === "dark"
                ? "text-purple-400 hover:bg-purple-900/30 hover:text-purple-200"
                : "text-purple-600 hover:bg-purple-100 hover:text-purple-900"
            )}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  theme === "dark"
                    ? "bg-purple-900/30 border border-purple-800/50 text-purple-200 hover:bg-purple-800/40"
                    : "bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100"
                )}
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="max-w-[100px] truncate">{session.user?.name}</span>
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div
                  className={cn(
                    "absolute right-0 top-12 w-48 rounded-xl border shadow-xl overflow-hidden",
                    theme === "dark"
                      ? "bg-dark-100 border-purple-900/50"
                      : "bg-white border-purple-100"
                  )}
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                      theme === "dark"
                        ? "text-purple-200 hover:bg-purple-900/30"
                        : "text-purple-800 hover:bg-purple-50"
                    )}
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                        theme === "dark"
                          ? "text-purple-200 hover:bg-purple-900/30"
                          : "text-purple-800 hover:bg-purple-50"
                      )}
                    >
                      <Shield size={15} /> Admin Panel
                    </Link>
                  )}
                  <div className={cn("h-px", theme === "dark" ? "bg-purple-900/50" : "bg-purple-100")} />
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors text-left",
                      theme === "dark"
                        ? "text-red-400 hover:bg-red-900/20"
                        : "text-red-600 hover:bg-red-50"
                    )}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(
                  "text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200",
                  theme === "dark"
                    ? "text-purple-300 hover:text-purple-100"
                    : "text-purple-700 hover:text-purple-900"
                )}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="relative text-sm font-semibold px-5 py-2.5 rounded-xl overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #7c22d4, #a855f7)",
                  boxShadow: "0 0 20px rgba(168,85,247,0.4)",
                }}
              >
                <span className="relative z-10 text-white tracking-wide">Sign Up</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-purple-400 hover:text-purple-200"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={cn(
            "md:hidden mt-2 mx-4 rounded-2xl border p-4 space-y-3",
            theme === "dark"
              ? "bg-dark-100/95 border-purple-900/50 backdrop-blur-xl"
              : "bg-white/95 border-purple-100 backdrop-blur-xl"
          )}
        >
          {["Services", "About"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block py-2 px-3 rounded-lg text-sm font-medium",
                theme === "dark" ? "text-purple-300 hover:bg-purple-900/30" : "text-purple-700 hover:bg-purple-50"
              )}
            >
              {item}
            </Link>
          ))}
          <div className={cn("h-px", theme === "dark" ? "bg-purple-900/50" : "bg-purple-100")} />
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                className={cn("block py-2 px-3 rounded-lg text-sm", theme === "dark" ? "text-purple-300" : "text-purple-700")}>
                Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full text-left py-2 px-3 rounded-lg text-sm text-red-400">
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                className={cn("flex-1 text-center py-2 rounded-lg text-sm border", theme === "dark" ? "border-purple-800 text-purple-300" : "border-purple-300 text-purple-700")}>
                Login
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2 rounded-lg text-sm text-white"
                style={{ background: "linear-gradient(135deg, #7c22d4, #a855f7)" }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
