import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="h-44 rounded-3xl bg-neutral-100 border border-black/10" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Skeleton */}
        <div className="bg-white rounded-3xl p-6 border border-black/10 space-y-4 shadow-sm">
          <div className="h-5 w-32 bg-neutral-200 rounded-lg" />
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-200" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-28 bg-neutral-200 rounded" />
              <div className="h-3 w-40 bg-neutral-200 rounded" />
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-black/10">
            <div className="h-3 w-full bg-neutral-200 rounded" />
            <div className="h-3 w-4/5 bg-neutral-200 rounded" />
            <div className="h-3 w-2/3 bg-neutral-200 rounded" />
          </div>
        </div>

        {/* Registration Card Skeleton */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-black/10 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="h-5 w-44 bg-neutral-200 rounded-lg" />
            <div className="h-5 w-24 bg-neutral-200 rounded-full" />
          </div>
          <div className="h-20 w-full bg-neutral-100 rounded-2xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="h-16 bg-neutral-100 rounded-xl" />
            <div className="h-16 bg-neutral-100 rounded-xl" />
            <div className="h-16 bg-neutral-100 rounded-xl" />
            <div className="h-16 bg-neutral-100 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-28 bg-white rounded-2xl border border-black/10 p-4 shadow-sm" />
        <div className="h-28 bg-white rounded-2xl border border-black/10 p-4 shadow-sm" />
        <div className="h-28 bg-white rounded-2xl border border-black/10 p-4 shadow-sm" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
