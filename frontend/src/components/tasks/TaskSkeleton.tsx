export default function TaskSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-start gap-3">
            <div className="skeleton w-5 h-5 rounded-full mt-0.5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/5 rounded" />
              <div className="skeleton h-3 w-4/5 rounded" />
              <div className="flex gap-2 mt-1">
                <div className="skeleton h-5 w-16 rounded-full" />
                <div className="skeleton h-5 w-14 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}