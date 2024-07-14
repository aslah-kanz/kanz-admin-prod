import { Skeleton } from '../ui/skeleton';

export default function RefundDetailLoading() {
  return (
    <div className=" w-full p-6">
      <div className=" w-full rounded-lg border p-5">
        <div className=" flex w-full flex-col gap-2">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6" />
            <div className="col-span-6">
              <Skeleton className="h-8" />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <Skeleton className="h-8" />
            </div>
            <div className="col-span-8">
              <Skeleton className="h-8" />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <Skeleton className="h-8" />
            </div>
            <div className="col-span-8">
              <Skeleton className="h-8" />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <Skeleton className="h-8" />
            </div>
            <div className="col-span-8">
              <Skeleton className="h-8" />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <Skeleton className="h-8" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-32" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-32" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-32" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-32" />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <Skeleton className="h-8" />
            </div>
            <div className="col-span-8">
              <Skeleton className="h-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
