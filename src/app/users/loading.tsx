export default function UsersLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 h-9 w-32 animate-pulse rounded bg-muted" />
      <div className="rounded-md border">
        <div className="space-y-4 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-6 flex-1 animate-pulse rounded bg-muted" />
              <div className="h-6 flex-1 animate-pulse rounded bg-muted" />
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
