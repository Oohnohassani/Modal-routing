function SkeletonLoadingPostCard() {
  return (
    <div className="flex w-96 animate-pulse flex-col overflow-hidden rounded-sm bg-neutral-800 sm:h-100 sm:w-170 sm:flex-row md:h-150 md:w-220">
      {/* Image */}
      <div className="h-72 bg-neutral-700 sm:h-full sm:w-1/2 md:w-[55%]" />

      {/* Right Side */}
      <div className="flex h-full flex-col bg-neutral-800 sm:w-1/2 md:w-[45%]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-700 p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-neutral-700" />

            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-neutral-700" />
              <div className="h-2 w-16 rounded bg-neutral-700" />
            </div>
          </div>

          <div className="h-4 w-4 rounded bg-neutral-700" />
        </div>

        {/* Post + Comments */}
        <div className="flex-1 space-y-5 overflow-hidden p-3">
          {/* Original Post */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-neutral-700" />

              <div className="space-y-1">
                <div className="h-2.5 w-20 rounded bg-neutral-700" />
                <div className="h-2 w-12 rounded bg-neutral-700" />
              </div>
            </div>

            <div className="ml-8 space-y-2">
              <div className="h-2.5 w-full rounded bg-neutral-700" />
              <div className="h-2.5 w-5/6 rounded bg-neutral-700" />
              <div className="h-2.5 w-2/3 rounded bg-neutral-700" />
            </div>
          </div>

          {/* Fake comments */}
          {[1, 2, 3].map((comment) => (
            <div key={comment}>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-neutral-700" />

                <div className="space-y-1">
                  <div className="h-2.5 w-20 rounded bg-neutral-700" />
                  <div className="h-2 w-10 rounded bg-neutral-700" />
                </div>
              </div>

              <div className="ml-8 space-y-2">
                <div className="h-2.5 w-full rounded bg-neutral-700" />
                <div className="h-2.5 w-3/4 rounded bg-neutral-700" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="border-t border-neutral-700 px-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-5">
              <div className="h-5 w-10 rounded bg-neutral-700" />
              <div className="h-5 w-10 rounded bg-neutral-700" />
              <div className="h-5 w-10 rounded bg-neutral-700" />
            </div>

            <div className="h-5 w-5 rounded bg-neutral-700" />
          </div>

          <div className="mt-4 space-y-2 pb-4">
            <div className="h-3 w-24 rounded bg-neutral-700" />
            <div className="h-2 w-20 rounded bg-neutral-700" />
          </div>
        </div>

        {/* Comment Input */}
        <div className="flex items-center gap-3 border-t border-neutral-700 p-3">
          <div className="h-6 w-6 rounded-full bg-neutral-700" />

          <div className="h-8 flex-1 rounded-full bg-neutral-700" />

          <div className="h-4 w-10 rounded bg-neutral-700" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoadingPostCard;
