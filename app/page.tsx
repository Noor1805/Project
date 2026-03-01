"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/app/components/Navigation";
import CursorGlow from "@/app/components/CursorGlow";

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // NextAuth SessionProvider will handle the session state in the background.

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <main className="min-h-screen bg-black overflow-x-hidden dot-pattern">
      <CursorGlow />
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-48 pb-16 sm:pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.02] mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-zinc-400">
                AI-Powered Strategy
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-7xl md:text-9xl font-bold mb-6 sm:mb-8 leading-[0.9] tracking-tighter"
            >
              TURN IDEAS <br />
              <span className="text-zinc-500">INTO ACTION.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-xl md:text-2xl text-zinc-400 mb-8 sm:mb-12 max-w-2xl leading-relaxed"
            >
              The advanced execution engine for modern founders. Analyze,
              structure, and launch your next venture with precision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                href="/register"
                className="btn-primary-premium text-lg px-10"
              >
                Start Building
              </Link>
              <button className="btn-secondary-premium text-lg px-10">
                View Sample
              </button>
            </motion.div>
          </div>
        </div>

        {/* Cinematic Flare */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] -z-10 rounded-full" />
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-32 px-4 sm:px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                title: "Market Analysis",
                description:
                  "Deep dive into target demographics and problem validation with AI precision.",
              },
              {
                title: "Architecture Plans",
                description:
                  "Scalable technical foundations optimized for speed and reliability.",
              },
              {
                title: "Growth Roadmap",
                description:
                  "Phased implementation strategy to take you from idea to graduation.",
              },
              {
                title: "Monetization",
                description:
                  "Data-driven revenue models tailored to your specific market segment.",
              },
              {
                title: "Risk Critic",
                description:
                  "Unfiltered analysis of potential pitfalls and execution barriers.",
              },
              {
                title: "MVP Features",
                description:
                  "Surgical focus on the core functionality that matters for launch.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-default"
              >
                <div className="mb-6 h-px w-full bg-zinc-800 group-hover:bg-white transition-colors duration-500" />
                <h3 className="text-xl font-bold mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Critic Mode Overhaul */}
      <section className="py-16 sm:py-32 px-4 sm:px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-6 sm:p-12 md:p-20 relative overflow-hidden group">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-semibold mb-6 sm:mb-8 tracking-tighter uppercase">
                THE REALITY <br />
                <span className="text-white/40">CHECK ENGINE.</span>
              </h2>
              <p className="text-xl text-zinc-500 mb-12 leading-relaxed">
                Most AI tells you what you want to hear. We tell you what you
                need to hear. Stress-test your assumptions with unfiltered
                market realism.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-medium">
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-1 h-1 rounded-full bg-white" />
                  Risk Assessment
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-1 h-1 rounded-full bg-white" />
                  Competitor Gaps
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-1 h-1 rounded-full bg-white" />
                  Execution Pitfalls
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-1 h-1 rounded-full bg-white" />
                  Difficult Reality
                </div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-64 h-64 bg-white/[0.02] blur-[100px] rounded-full group-hover:bg-white/[0.05] transition-all duration-700" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-48 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-8 sm:mb-12 tracking-tighter">
            READY TO <br />
            BUILD THE FUTURE?
          </h2>
          <Link
            href="/register"
            className="btn-primary-premium text-xl px-12 py-5 shadow-2xl"
          >
            Register Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/[0.05] text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-xs font-black text-zinc-400">
              B
            </div>
            <span className="text-sm font-bold tracking-tighter uppercase">
              Blueprint AI
            </span>
          </div>
          <p className="text-xs font-medium tracking-wider uppercase">
            © 2024 PRECISION BUILT. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </main>
  );
}
