import React from "react";
import "./skeleton.css";

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
  parent,
}) => {
  return (
    <div style={parent?.style} className={`${className}`}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            style={{
              background:
                "linear-gradient(90deg, rgba(220, 220, 220, 1) 0%, rgba(240, 240, 240, 1) 50%, rgba(220, 220, 220, 1) 100%)",
            }}
            key={index}
            className={`skeletonLoading ${children?.className}  w-full`}
          ></div>
        ))}
    </div>
  );
};
