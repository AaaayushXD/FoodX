import React from "react";
import "./skeleton.css"
interface SkeletonProps {
  count?: number;
  parent?: {
    style: React.CSSProperties;
  };
  className?: string;
  children: {
    className: string;
  };
}

export const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  className = "",
  children,
  parent
}) => {
  return (
    <div style={parent?.style} className={`${className}`}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            
            key={index}
            className={`skeletonLoading ${children?.className}  w-full`}
          ></div>
        ))}
    </div>
  );
};
