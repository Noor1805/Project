"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Navigation } from "@/app/components/Navigation";
import { getBlueprints } from "@/lib/api";
import BlueprintForm from "@/app/components/BlueprintForm";
import BlueprintList from "@/app/components/BlueprintList";
import { Button } from "@/app/components/ui/Button";
import CursorGlow from "@/app/components/CursorGlow";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const user = session?.user;
  const router = useRouter();
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "generate">("list");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (user) {
      fetchBlueprints();
    }
  }, [user]);

  const fetchBlueprints = async () => {
    try {
      setLoading(true);
      const response = await getBlueprints();
      if (response.data.success) {
        setBlueprints(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch blueprints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlueprintCreated = () => {
    setActiveTab("list");
    fetchBlueprints();
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black dot-pattern relative overflow-hidden">
      <CursorGlow />
      <Navigation />

      <div className="max-w-7xl mx-auto px-8 pt-40 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tighter uppercase whitespace-nowrap">
                Command Center<span className="text-zinc-600">.</span>
              </h1>
              <p className="text-lg text-zinc-500 max-w-xl leading-relaxed">
                Welcome back, {user.name}. You have {blueprints.length} active
                execution blueprints in your architecture.
              </p>
            </div>

            {/* Tab Controller */}
            <div className="flex p-1 bg-zinc-900 rounded-full border border-white/[0.05]">
              <button
                onClick={() => setActiveTab("list")}
                className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${
                  activeTab === "list"
                    ? "bg-white text-black shadow-xl"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Blueprints
              </button>
              <button
                onClick={() => setActiveTab("generate")}
                className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${
                  activeTab === "generate"
                    ? "bg-white text-black shadow-xl"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Generate
              </button>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="relative">
            {activeTab === "list" ? (
              <div className="animate-reveal">
                <BlueprintList
                  blueprints={blueprints}
                  loading={loading}
                  onRefresh={fetchBlueprints}
                />
              </div>
            ) : (
              <div className="max-w-3xl animate-reveal">
                <div className="glass-card p-10">
                  <h2 className="text-2xl font-bold mb-8 tracking-tight">
                    Generate New Strategy
                  </h2>
                  <BlueprintForm onSuccess={handleBlueprintCreated} />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Cinematic Blur */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-64 bg-white/[0.01] blur-[120px] pointer-events-none" />
    </main>
  );
}
