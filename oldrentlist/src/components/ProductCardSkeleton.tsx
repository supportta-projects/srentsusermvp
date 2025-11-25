export default function ProductCardSkeleton() {
  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#141414] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-[#0a0a0a]" />
      <div className="p-3 space-y-2.5">
        <div className="h-2 bg-white/5 rounded w-1/4" />
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-12 bg-white/5 rounded-lg" />
        <div className="h-2 bg-white/5 rounded w-1/2" />
        <div className="h-9 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}
