"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export const Navigation = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] backdrop-blur-xl bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black text-xl group-hover:scale-105 transition-transform">
            B
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tighter text-white">
            BLUEPRINT AI
          </span>
        </Link>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-8">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${pathname === "/dashboard" ? "text-white" : "text-zinc-400 hover:text-white"}`}
              >
                Dashboard
              </Link>
              <div className="h-4 w-px bg-zinc-800" />
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-400">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-primary-premium !py-2 !px-6 !text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/[0.08] bg-black/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-reveal">
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${pathname === "/dashboard" ? "text-white" : "text-zinc-400"}`}
              >
                Dashboard
              </Link>
              <div className="border-t border-white/[0.08] pt-3 flex items-center justify-between">
                <span className="text-sm text-zinc-400">{user.name}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-400"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-center btn-primary-premium !py-2 !text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
