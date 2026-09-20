export function PageLoading({ app = false }: { app?: boolean }) {
  return (
    <div
      aria-label="Loading"
      className={`mx-auto min-h-[50vh] w-full px-4 py-8 sm:px-6 ${app ? "max-w-6xl" : "max-w-5xl"}`}
    >
      <div className="space-y-4" aria-hidden="true">
        <div className="loading-line h-8 w-56" />
        <div className="loading-line h-4 w-80 max-w-full" />
        <div className="grid gap-4 pt-4 lg:grid-cols-3">
          <div className="loading-panel h-28 lg:col-span-2" />
          <div className="loading-panel h-28" />
          <div className="loading-panel h-56 lg:col-span-2" />
          <div className="loading-panel h-56" />
        </div>
      </div>
    </div>
  );
}
