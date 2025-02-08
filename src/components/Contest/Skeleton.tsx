import { type FC } from "react";

const HeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-start justify-center gap-2">
                <div className="w-8 h-4 bg-gray-200 rounded-md animate-pulse" />
                <div className="flex items-center justify-center gap-2">
                  <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse" />
                  <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse" />
                </div>
              </div>
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="divider divider-horizontal animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-start justify-center gap-2">
                <div className="w-8 h-4 bg-gray-200 rounded-md animate-pulse" />
                <div className="flex items-center justify-center gap-2">
                  <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse" />
                  <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse" />
                </div>
              </div>
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </div>
      <div className="bg-gray-200 w-full h-16 animate-pulse items-center rounded-md mx-auto" />
      <div className="bg-gray-200 w-96 h-16 animate-pulse items-center rounded-md mx-auto" />
    </div>
  );
};

export const Skeleton: FC = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <HeaderSkeleton />
      <div className="flex flex-col gap-4">
        <div className="bg-gray-200 w-24 h-6 animate-pulse items-center rounded-md mx-auto" />
        <div className="bg-gray-200 w-16 h-6 animate-pulse items-center rounded-md mx-auto" />
        <div className="bg-gray-200 w-full h-28 animate-pulse items-center rounded-md mx-auto" />
        <div className="bg-gray-200 w-72 h-12 animate-pulse items-center rounded-md mx-auto" />
        <div className="bg-gray-200 w-40 h-12 animate-pulse items-center rounded-md mx-auto" />
        <div className="bg-gray-200 w-full h-96 animate-pulse items-center rounded-md mx-auto" />
      </div>
    </div>
  );
};
