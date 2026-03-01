"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import CursorGlow from "@/app/components/CursorGlow";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-black dot-pattern flex items-center justify-center px-6 transition-colors duration-500 relative overflow-hidden">
      <CursorGlow />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10 text-center"
      >
        <div className="glass-premium p-10 md:p-12 rounded-[32px] shadow-2xl">
          <h1 className="text-3xl font-extrabold tracking-tighter uppercase mb-6">
            Authentication Update<span className="text-zinc-600">.</span>
          </h1>
          <p className="text-zinc-500 font-medium mb-8">
            We have migrated to Google Auth. Please use the Sign In page to
            access your account.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full !py-4 !rounded-2xl text-lg font-bold shadow-2xl"
          >
            Go to Sign In
          </Button>
          <p className="text-sm text-zinc-600 mt-6">
            Redirecting to login in 3 seconds...
          </p>
        </div>
      </motion.div>
    </main>
  );
}
