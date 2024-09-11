import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center py-4">
        <Skeleton className="max-w-sm h-10" />
      </div>
      <div className="flex gap-3 md:gap-5 flex-wrap">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="w-full md:w-64 h-64" />
        ))}
      </div>
    </div>
  );
}
