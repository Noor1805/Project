"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { getBlueprint } from "@/lib/api";
import Link from "next/link";
import { Blueprint } from "@/types";

export default function BlueprintDetailPage() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const user = session?.user;
  const router = useRouter();
  const params = useParams();
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "technical" | "roadmap" | "critic"
  >("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (user && params.id) {
      fetchBlueprint();
    }
  }, [user, params.id]);

  const fetchBlueprint = async () => {
    try {
      setLoading(true);
      const response = await getBlueprint(params.id as string);

      if (response.data.success) {
        setBlueprint(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch blueprint:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !blueprint) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-shimmer glass p-12 rounded-xl h-96" />
        </div>
      </main>
    );
  }

  const data = blueprint.structuredOutput;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            {blueprint.ideaTitle}
          </h1>
          <p className="text-slate-400">{blueprint.ideaDescription}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-sm z-40 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-4 sm:gap-8 min-w-max">
            {[
              { id: "overview", label: "Overview" },
              { id: "technical", label: "Technical" },
              { id: "roadmap", label: "Roadmap" },
              ...(blueprint.criticModeEnabled
                ? [{ id: "critic", label: "Critic Analysis" }]
                : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Executive Summary */}
              <div className="glass p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
                <p className="text-slate-300 leading-relaxed">{data.summary}</p>
              </div>

              {/* Problem & Target Users */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass p-8 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">Problem Statement</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {data.problem_statement}
                  </p>
                </div>
                <div className="glass p-8 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">Target Users</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {data.target_users}
                  </p>
                </div>
              </div>

              {/* Core Features */}
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Core Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.core_features.map((feature, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-blue-400 text-lg mt-1">✓</span>
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monetization */}
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4">
                  Monetization Strategy
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {data.monetization_strategy}
                </p>
              </div>

              {/* Timeline */}
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Estimated Timeline</h3>
                <p className="text-slate-300 leading-relaxed">
                  {data.estimated_timeline}
                </p>
              </div>
            </div>
          )}

          {activeTab === "technical" && (
            <div className="space-y-8">
              {/* Tech Stack */}
              <div className="glass p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">
                  Recommended Tech Stack
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">
                      Frontend
                    </h3>
                    <p className="text-slate-300">{data.tech_stack.frontend}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">
                      Backend
                    </h3>
                    <p className="text-slate-300">{data.tech_stack.backend}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">
                      Database
                    </h3>
                    <p className="text-slate-300">{data.tech_stack.database}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">
                      Infrastructure
                    </h3>
                    <p className="text-slate-300">
                      {data.tech_stack.infrastructure}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Architecture */}
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4">System Architecture</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {data.system_architecture}
                </p>
              </div>

              {/* Database Schema */}
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Database Schema</h3>
                <div className="space-y-4">
                  {data.database_schema.map((schema, i) => (
                    <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
                      <h4 className="font-mono font-bold text-blue-400 mb-2">
                        {schema.table_name}
                      </h4>
                      <div className="space-y-1">
                        {schema.fields.map((field, j) => (
                          <div
                            key={j}
                            className="text-sm text-slate-300 font-mono"
                          >
                            <span className="text-yellow-400">
                              {field.name}
                            </span>
                            <span className="text-slate-500">
                              {" "}
                              ({field.type})
                            </span>
                            <span className="text-slate-400">
                              {" "}
                              - {field.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Endpoints */}
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4">API Endpoints</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {data.api_endpoints.map((endpoint, i) => (
                    <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
                      <div className="flex gap-3 items-start mb-2">
                        <span className="font-mono font-bold text-green-400 w-16">
                          {endpoint.method}
                        </span>
                        <span className="font-mono text-blue-400">
                          {endpoint.path}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">
                        {endpoint.description}
                      </p>
                      {endpoint.parameters && (
                        <p className="text-xs text-slate-400">
                          Parameters: {endpoint.parameters.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scaling Strategy */}
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Scaling Strategy</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {data.scaling_strategy}
                </p>
              </div>
            </div>
          )}

          {activeTab === "roadmap" && (
            <div className="space-y-6">
              {data.development_roadmap.map((phase, i) => (
                <motion.div
                  key={i}
                  className="glass p-8 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-500/20 border border-blue-500/50">
                        <span className="text-blue-400 font-bold">{i + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{phase.phase}</h3>
                      <p className="text-sm text-slate-400 mb-3">
                        Duration: {phase.duration}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 mb-2">
                            Tasks:
                          </p>
                          <ul className="space-y-1">
                            {phase.tasks.map((task, j) => (
                              <li key={j} className="text-sm text-slate-300">
                                • {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 mb-2">
                            Deliverables:
                          </p>
                          <ul className="space-y-1">
                            {phase.deliverables.map((d, j) => (
                              <li key={j} className="text-sm text-slate-300">
                                ✓ {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "critic" && data.critic_analysis && (
            <div className="space-y-6">
              <div className="bg-red-950/20 border border-red-500/50 p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">
                  Brutal Critic Analysis
                </h2>

                <div className="space-y-6">
                  {/* Market Risks */}
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-3">
                      Market Risks
                    </h3>
                    <ul className="space-y-2">
                      {data.critic_analysis.market_risks.map((risk, i) => (
                        <li key={i} className="flex gap-2 text-slate-300">
                          <span className="text-red-400">⚠</span> {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Execution Risks */}
                  <div>
                    <h3 className="text-lg font-bold text-orange-400 mb-3">
                      Execution Risks
                    </h3>
                    <ul className="space-y-2">
                      {data.critic_analysis.execution_risks.map((risk, i) => (
                        <li key={i} className="flex gap-2 text-slate-300">
                          <span className="text-orange-400">⚠</span> {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Competitive Threats */}
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-3">
                      Competitive Threats
                    </h3>
                    <ul className="space-y-2">
                      {data.critic_analysis.competitive_threats.map(
                        (threat, i) => (
                          <li key={i} className="flex gap-2 text-slate-300">
                            <span className="text-yellow-400">⚡</span> {threat}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {/* Difficulty Score */}
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Overall Difficulty Score</h4>
                    <p className="text-slate-300 whitespace-pre-wrap">
                      {data.critic_analysis.difficulty_score}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
