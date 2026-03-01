'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { deleteBlueprint } from '@/lib/api';

interface Blueprint {
  _id: string;
  ideaTitle: string;
  ideaDescription: string;
  criticModeEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlueprintListProps {
  blueprints: Blueprint[];
  loading: boolean;
  onRefresh: () => void;
}

export default function BlueprintList({
  blueprints,
  loading,
  onRefresh,
}: BlueprintListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blueprint?')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await deleteBlueprint(id);

      if (response.data.success) {
        onRefresh();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass p-6 rounded-xl h-48 animate-shimmer" />
        ))}
      </div>
    );
  }

  if (blueprints.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-2xl text-center"
      >
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-xl font-semibold mb-2">No blueprints yet</h3>
        <p className="text-slate-400 mb-6">
          Create your first execution blueprint to get started
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {blueprints.map((blueprint, i) => (
        <motion.div
          key={blueprint._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass p-6 rounded-xl hover:border-slate-600 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                {blueprint.ideaTitle}
              </h3>
              <p className="text-sm text-slate-400 line-clamp-2">
                {blueprint.ideaDescription}
              </p>
            </div>
            {blueprint.criticModeEnabled && (
              <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-200 text-xs rounded-full whitespace-nowrap">
                Critic Mode
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              {new Date(blueprint.createdAt).toLocaleDateString()}
            </p>

            <div className="flex gap-2">
              <Link
                href={`/blueprint/${blueprint._id}`}
                className="text-xs button-secondary px-3 py-1"
              >
                View
              </Link>
              <button
                onClick={() => handleDelete(blueprint._id)}
                disabled={deleting === blueprint._id}
                className="text-xs button-danger px-3 py-1 disabled:opacity-50"
              >
                {deleting === blueprint._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}