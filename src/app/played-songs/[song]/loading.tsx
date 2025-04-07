import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-3 m-4 md:m-0 border-2 rounded-lg">
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="size-[356px] md:size-[500px] rounded-lg" />
        <div className="flex flex-col justify-between p-3 gap-4 md:gap-0">
          <Skeleton className="h-32 w-72 rounded-md" />
          <Skeleton className="h-12 w-72 rounded-md" />
        </div>
      </div>
    </div>
  );
}
