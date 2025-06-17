export function ProductLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-[28rem] bg-muted animate-pulse rounded-lg"
        ></div>
      ))}
    </div>
  );
}
