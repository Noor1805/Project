'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateBlueprint } from '@/lib/api';

interface BlueprintFormProps {
  onSuccess: () => void;
}

export default function BlueprintForm({ onSuccess }: BlueprintFormProps) {
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [platformType, setPlatformType] = useState('web');
  const [budgetRange, setBudgetRange] = useState('50k-100k');
  const [technicalSkillLevel, setTechnicalSkillLevel] = useState('intermediate');
  const [criticModeEnabled, setCriticModeEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await generateBlueprint({
        ideaTitle,
        ideaDescription,
        targetAudience,
        platformType,
        budgetRange,
        technicalSkillLevel,
        criticModeEnabled,
      });

      if (response.data.success) {
        // Reset form
        setIdeaTitle('');
        setIdeaDescription('');
        setTargetAudience('');
        setPlatformType('web');
        setBudgetRange('50k-100k');
        setTechnicalSkillLevel('intermediate');
        setCriticModeEnabled(false);
        onSuccess();
      } else {
        setError(response.data.error || 'Failed to generate blueprint');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-2xl max-w-2xl"
    >
      <h2 className="text-2xl font-bold mb-6">Generate New Blueprint</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Idea Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Startup Idea Title *</label>
          <input
            type="text"
            value={ideaTitle}
            onChange={(e) => setIdeaTitle(e.target.value)}
            placeholder="e.g., AI-Powered Meeting Assistant"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 input-focus"
            required
          />
          <p className="text-xs text-slate-400 mt-1">Keep it concise and descriptive</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Detailed Description *</label>
          <textarea
            value={ideaDescription}
            onChange={(e) => setIdeaDescription(e.target.value)}
            placeholder="Explain your idea, the problem it solves, and why it's unique..."
            rows={5}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 input-focus resize-none"
            required
          />
          <p className="text-xs text-slate-400 mt-1">Min 20 characters - be specific</p>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium mb-2">Target Audience *</label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g., B2B SaaS companies with 50-500 employees"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 input-focus"
            required
          />
        </div>

        {/* Platform Type */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Platform Type</label>
            <select
              value={platformType}
              onChange={(e) => setPlatformType(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white input-focus"
            >
              <option value="web">Web Application</option>
              <option value="mobile">Mobile App</option>
              <option value="desktop">Desktop Software</option>
              <option value="saas">SaaS Platform</option>
              <option value="marketplace">Marketplace</option>
              <option value="api">API Service</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Budget Range</label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white input-focus"
            >
              <option value="<10k">Less than $10k</option>
              <option value="10k-50k">$10k - $50k</option>
              <option value="50k-100k">$50k - $100k</option>
              <option value="100k-250k">$100k - $250k</option>
              <option value="250k+">$250k+</option>
            </select>
          </div>
        </div>

        {/* Technical Skill Level */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Technical Skill Level</label>
          <select
            value={technicalSkillLevel}
            onChange={(e) => setTechnicalSkillLevel(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white input-focus"
          >
            <option value="beginner">Beginner - I'm learning</option>
            <option value="intermediate">Intermediate - I can build basic apps</option>
            <option value="advanced">Advanced - I can build complex systems</option>
            <option value="expert">Expert - I've shipped multiple products</option>
          </select>
        </div>

        {/* Critic Mode Toggle */}
        <div className="bg-slate-800/30 border border-slate-700 p-4 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={criticModeEnabled}
              onChange={(e) => setCriticModeEnabled(e.target.checked)}
              className="w-5 h-5 rounded border-slate-600 text-blue-600 cursor-pointer"
            />
            <div>
              <p className="font-medium">Enable Brutal Critic Mode</p>
              <p className="text-xs text-slate-400">
                Get honest feedback on risks, challenges, and competitive threats
              </p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 button-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Blueprint...
              </span>
            ) : (
              'Generate Blueprint'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}