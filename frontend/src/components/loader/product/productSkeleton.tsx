import React from "react";
import "./productSkeleton.css";

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="w-full relative flex flex-col items-center justify-start gap-3">
      {/* Product Banner Image Skeleton */}
      <div className="md:h-[60vh] sm:h-[50vh] h-[45vh] relative w-screen bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        
        {/* Top Navigation Skeleton */}
        <div className="absolute top-5 left-5 right-8 flex z-[10000] items-center justify-between">
          <div className="w-6 h-6 bg-white/20 rounded-full shimmer"></div>
          <div className="flex items-center gap-8">
            <div className="w-10 h-10 bg-white/20 rounded-full shimmer"></div>
            <div className="w-10 h-10 bg-white/20 rounded-full shimmer"></div>
          </div>
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="w-full z-[1] mt-[-50px] md:mt-[-80px] px-3 sm:px-16">
        <div className="w-full gap-10 p-3 sm:px-10 sm:py-10 rounded-t-2xl flex flex-col items-center justify-center bg-white">
          
          {/* Product Info Skeleton */}
          <div className="w-full flex items-start justify-start gap-5 flex-col">
            {/* Category Badge Skeleton */}
            <div className="flex w-full gap-2 flex-col items-start">
              <div className="w-20 h-6 bg-gray-200 rounded-full shimmer"></div>
              
              {/* Product Title Skeleton */}
              <div className="w-3/4 h-8 bg-gray-200 rounded shimmer"></div>
              
              {/* Product Stats Skeleton */}
              <div className="flex items-center justify-start gap-2">
                <div className="w-16 h-6 bg-gray-200 rounded-full shimmer"></div>
                <div className="w-20 h-6 bg-gray-200 rounded-full shimmer"></div>
                <div className="w-16 h-6 bg-gray-200 rounded-full shimmer"></div>
              </div>
            </div>

            {/* Price and Cart Button Skeleton */}
            <div className="flex w-full flex-col items-start justify-start gap-4">
              <div className="w-full flex mt-4 flex-wrap gap-4 items-center justify-between text-sm">
                <div className="flex flex-col sm:flex-row sm:items-end items-start justify-start h-full sm:gap-3">
                  <div className="w-24 h-8 bg-gray-200 rounded shimmer"></div>
                  <div className="w-20 h-6 bg-gray-200 rounded shimmer"></div>
                </div>
                <div className="w-32 h-12 bg-gray-200 rounded-full shimmer"></div>
              </div>
            </div>

            {/* Product Description Skeleton */}
            <div className="flex flex-col items-start justify-start gap-0.5">
              <div className="w-16 h-6 bg-gray-200 rounded shimmer"></div>
              <div className="w-full space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded shimmer"></div>
                <div className="w-5/6 h-4 bg-gray-200 rounded shimmer"></div>
                <div className="w-4/5 h-4 bg-gray-200 rounded shimmer"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded shimmer"></div>
              </div>
            </div>
          </div>

          {/* Recommended Products Skeleton */}
          <div className="flex w-full relative flex-col items-start justify-start gap-6">
            <div className="w-48 h-6 bg-gray-200 rounded shimmer"></div>
            <div className="w-full h-full overflow-y-hidden overflow-x-auto">
              <div className="w-max flex items-start justify-start gap-5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="w-48 h-64 bg-gray-200 rounded-lg shimmer"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Reviews Skeleton */}
          <div className="w-full flex flex-col items-start justify-start gap-16">
            <div className="flex flex-col sm:items-start items-center w-full justify-start gap-5 sm:gap-10">
              <div className="w-full space-y-4">
                <div className="w-32 h-8 bg-gray-200 rounded shimmer"></div>
                <div className="w-full h-16 bg-gray-200 rounded shimmer"></div>
                <div className="w-full h-16 bg-gray-200 rounded shimmer"></div>
              </div>
            </div>
            <div className="w-full flex flex-col items-center justify-start gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="w-full max-w-lg h-20 bg-gray-200 rounded shimmer"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 