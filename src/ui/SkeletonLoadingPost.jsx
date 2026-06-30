function SkeletonLoadingPost() {
  return (
    <div className="flex w-120 animate-pulse flex-col gap-2 rounded-lg bg-neutral-800 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-neutral-700" />

          {/* Username + Date */}
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-neutral-700" />
            <div className="h-2 w-20 rounded bg-neutral-700" />
          </div>
        </div>

        {/* Menu */}
        <div className="h-4 w-4 rounded bg-neutral-700" />
      </div>

      {/* Post text */}
      <div className="my-4 space-y-2">
        <div className="h-3 w-full rounded bg-neutral-700" />
        <div className="h-3 w-5/6 rounded bg-neutral-700" />
        <div className="h-3 w-2/3 rounded bg-neutral-700" />
      </div>

      {/* Image */}
      <div className="h-72 w-full rounded-lg bg-neutral-700" />

      {/* Stats */}
      <div className="mt-3 flex items-center justify-between px-2">
        <div className="flex gap-6">
          <div className="h-5 w-12 rounded bg-neutral-700" />
          <div className="h-5 w-12 rounded bg-neutral-700" />
          <div className="h-5 w-12 rounded bg-neutral-700" />
        </div>

        <div className="h-5 w-5 rounded bg-neutral-700" />
      </div>

      {/* Comment input */}
      <div className="my-4 flex items-center gap-3 px-3">
        <div className="h-7 w-7 rounded-full bg-neutral-700" />

        <div className="h-9 flex-1 rounded-full bg-neutral-700" />

        <div className="h-7 w-7 rounded-full bg-neutral-700" />
      </div>

      {/* Fake comments */}
      <div className="space-y-4 px-2">
        {[1, 2].map((item) => (
          <div key={item} className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-neutral-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-neutral-700" />
              <div className="h-3 w-full rounded bg-neutral-700" />
              <div className="h-3 w-2/3 rounded bg-neutral-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonLoadingPost;
