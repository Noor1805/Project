"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Navigation } from "@/app/components/Navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { apiClient } from "@/lib/api";
import {
  PLATFORM_TYPES,
  BUDGET_RANGES,
  TECH_SKILL_LEVELS,
} from "@/lib/constants";

export default function GeneratePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    ideaTitle: "",
    ideaDescription: "",
    targetAudience: "",
    platformType: "web",
    budgetRange: "25-50k",
    technicalSkillLevel: "intermediate",
    criticModeEnabled: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      criticModeEnabled: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post("/api/blueprints", formData);

      if (response.data.success) {
        addToast("Blueprint generated successfully!", "success");
        router.push(`/blueprint/${response.data.data.id}`);
      } else {
        addToast(
          response.data.message || "Failed to generate blueprint",
          "error",
        );
      }
    } catch (error: any) {
      addToast(error.response?.data?.message || "An error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      addToast("Logout failed", "error");
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navigation isAuthenticated={!!session} onLogout={handleLogout} />

      <div className="container-padding max-w-2xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Generate Your Blueprint</h1>
            <p className="text-slate-300">
              Tell us about your idea and we'll create a comprehensive execution
              plan
            </p>
          </div>

          <Card variant="glass">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Idea Title"
                name="ideaTitle"
                value={formData.ideaTitle}
                onChange={handleInputChange}
                placeholder="e.g., AI-powered fitness coaching"
                required
              />

              <Textarea
                label="Idea Description"
                name="ideaDescription"
                value={formData.ideaDescription}
                onChange={handleInputChange}
                placeholder="Describe your idea in detail. What problem does it solve?"
                rows={4}
                required
              />

              <Textarea
                label="Target Audience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="Who are your ideal customers? Describe their profile."
                rows={3}
                required
              />

              <Select
                label="Platform Type"
                name="platformType"
                value={formData.platformType}
                onChange={handleInputChange}
                options={PLATFORM_TYPES}
              />

              <Select
                label="Budget Range"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleInputChange}
                options={BUDGET_RANGES}
              />

              <Select
                label="Technical Skill Level"
                name="technicalSkillLevel"
                value={formData.technicalSkillLevel}
                onChange={handleInputChange}
                options={TECH_SKILL_LEVELS}
              />

              <div className="border-t border-white/10 pt-6">
                <Checkbox
                  label="Enable Brutal Critic Mode - Get honest feedback on risks and challenges"
                  name="criticModeEnabled"
                  checked={formData.criticModeEnabled}
                  onChange={handleCheckboxChange}
                />
                <p className="text-slate-400 text-sm mt-2">
                  The AI will provide critical analysis of market risks,
                  execution challenges, and competitive threats alongside your
                  blueprint.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? "Generating..." : "Generate Blueprint"}
              </Button>
            </form>
          </Card>

          <Card variant="solid">
            <h3 className="text-lg font-semibold mb-4">What's Included</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Problem statement and market opportunity</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Target user personas and market analysis</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Prioritized feature breakdown for MVP</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Recommended tech stack</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>System architecture overview</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Database schema design</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>API endpoint structure</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Phased development roadmap</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Monetization strategy</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Scaling strategy and timeline</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
