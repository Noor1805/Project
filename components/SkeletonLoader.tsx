import React from 'react';

export const SkeletonLoader: React.FC<{ count?: number; height?: string }> = ({
  count = 3,
  height = 'h-12',
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-loader ${height} rounded-lg bg-slate-800 animate-shimmer`}
        />
      ))}
    </div>
  );
};

export const CardSkeletonLoader: React.FC = () => {
  return (
    <div className="glass rounded-lg p-6 space-y-4">
      <div className="skeleton-loader h-6 w-3/4 rounded" />
      <div className="skeleton-loader h-4 w-full rounded" />
      <div className="skeleton-loader h-4 w-2/3 rounded" />
      <div className="flex gap-4 pt-4">
        <div className="skeleton-loader h-10 w-24 rounded" />
        <div className="skeleton-loader h-10 w-24 rounded" />
      </div>
    </div>
  );
};