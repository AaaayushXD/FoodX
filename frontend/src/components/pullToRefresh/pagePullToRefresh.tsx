import React, { ReactNode } from 'react';
import { PullToRefresh } from './pullToRefresh';
import { useQueryClient } from '@tanstack/react-query';
import { toaster } from '@/utils';
import toast from 'react-hot-toast';

interface PagePullToRefreshProps {
  children: ReactNode;
  queryKeys?: string[];
  onRefresh?: () => Promise<void> | void;
  className?: string;
  threshold?: number;
  maxPullDistance?: number;
  disabled?: boolean;
}

export const PagePullToRefresh: React.FC<PagePullToRefreshProps> = ({
  children,
  queryKeys = [],
  onRefresh,
  className = '',
  threshold = 80,
  maxPullDistance = 120,
  disabled = false,
}) => {
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    const loadingToast = toaster({
      title: "Refreshing...",
      icon: "loading",
    });

    try {
      // If custom refresh function is provided, use it
      if (onRefresh) {
        await onRefresh();
      } else if (queryKeys.length > 0) {
        // Otherwise, invalidate the specified query keys
        await Promise.all(
          queryKeys.map(queryKey => 
            queryClient.invalidateQueries({ queryKey: [queryKey] })
          )
        );
      }

      toaster({
        title: "Refreshed!",
        icon: "success",
        message: "Page data has been updated",
      });
    } catch (error) {
      console.error("Page refresh error:", error);
      toaster({
        title: "Refresh failed",
        icon: "error",
        message: "Failed to refresh page data. Please try again.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      className={className}
      threshold={threshold}
      maxPullDistance={maxPullDistance}
      disabled={disabled}
    >
      {children}
    </PullToRefresh>
  );
};

export default PagePullToRefresh; 