export default function PostSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-2xl bg-white shadow-sm">
      {/* avatar + name */}
      <div className="flex items-center gap-3 p-4 sm:p-5">
        <div className="h-10 w-10 rounded-full bg-gray-200 sm:h-11 sm:w-11" />
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-100" />
        </div>
      </div>

      {/* text lines */}
      <div className="space-y-2 px-4 pb-5 sm:px-5">
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-11/12 rounded bg-gray-200" />
        <div className="h-3 w-2/3 rounded bg-gray-200" />
      </div>

      {/* action bar */}
      <div className="flex gap-3 border-t border-gray-100 px-4 py-3 sm:px-5">
        <div className="h-8 w-16 rounded-lg bg-gray-100" />
        <div className="h-8 w-20 rounded-lg bg-gray-100" />
        <div className="h-8 w-16 rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}
