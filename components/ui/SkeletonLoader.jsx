// components/ui/SkeletonLoader.jsx
// Shows animated placeholder while content loads

export default function SkeletonLoader({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded-xl ${className}`}>
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}

// Pre-built skeleton layouts
export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
      <SkeletonLoader className="h-6 w-3/4" />
      <SkeletonLoader className="h-4 w-full" />
      <SkeletonLoader className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <SkeletonLoader className="h-8 w-20" />
        <SkeletonLoader className="h-8 w-20" />
      </div>
    </div>
  );
}

export function ResponseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonLoader className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader className="h-4 w-1/3" />
          <SkeletonLoader className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonLoader className="h-20 w-full" />
    </div>
  );
}
