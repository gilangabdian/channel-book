import { BookOpen } from "lucide-react";

export default function SearchLoading() {
  return (
    <div className="min-h-full bg-neutral-50 pt-4 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* LEFT: RESULTS SKELETON (70%) */}
          <div className="w-full md:w-3/4">
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden"
                >
                  {/* Cover Skeleton */}
                  <div className="w-24 sm:w-28 md:w-32 aspect-[2/3] sm:aspect-[3/4] bg-neutral-200 animate-pulse shrink-0 flex items-center justify-center">
                    <BookOpen className="size-8 text-neutral-300" />
                  </div>
                  
                  {/* Info Skeleton */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      {/* Type badge */}
                      <div className="h-5 w-16 bg-neutral-200 animate-pulse rounded-md mb-2" />
                      {/* Title */}
                      <div className="h-6 w-3/4 bg-neutral-200 animate-pulse rounded mb-2" />
                      <div className="h-6 w-1/2 bg-neutral-200 animate-pulse rounded" />
                      {/* Author */}
                      <div className="h-4 w-1/3 bg-neutral-200 animate-pulse rounded mt-3" />
                    </div>
                    
                    {/* Bottom stats */}
                    <div className="mt-4 flex items-center gap-4">
                      <div className="h-4 w-12 bg-neutral-200 animate-pulse rounded" />
                      <div className="h-4 w-20 bg-neutral-200 animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: FILTERS SKELETON (30%) */}
          <div className="w-full md:w-1/4 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 sticky top-6">
              <div className="h-5 w-20 bg-neutral-200 animate-pulse rounded mb-4" />
              
              <div className="space-y-6">
                <div>
                  <div className="h-4 w-12 bg-neutral-200 animate-pulse rounded mb-3" />
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="size-4 rounded bg-neutral-200 animate-pulse" />
                        <div className="h-4 w-16 bg-neutral-200 animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="h-4 w-32 bg-neutral-200 animate-pulse rounded mb-3" />
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="size-4 rounded bg-neutral-200 animate-pulse" />
                        <div className="h-4 w-24 bg-neutral-200 animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
