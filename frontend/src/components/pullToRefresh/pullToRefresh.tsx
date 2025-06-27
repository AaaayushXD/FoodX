import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/utils';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  maxPullDistance?: number;
  className?: string;
  disabled?: boolean;
}

interface PullState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  startY: number;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  className = '',
  disabled = false,
}) => {
  const [pullState, setPullState] = useState<PullState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    startY: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window;
  }, []);

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled || pullState.isRefreshing) return;

    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop > 0) return;

    setPullState(prev => ({
      ...prev,
      startY: e.touches[0].clientY,
      isPulling: true,
    }));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (disabled || !pullState.isPulling || pullState.isRefreshing) return;

    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop > 0) return;

    const currentY = e.touches[0].clientY;
    const pullDistance = Math.max(0, currentY - pullState.startY);
    const limitedPullDistance = Math.min(pullDistance * 0.6, maxPullDistance);

    e.preventDefault();
    setPullState(prev => ({
      ...prev,
      pullDistance: limitedPullDistance,
    }));
  };

  const handleTouchEnd = async () => {
    if (disabled || !pullState.isPulling || pullState.isRefreshing) return;

    if (pullState.pullDistance >= threshold) {
      setPullState(prev => ({
        ...prev,
        isRefreshing: true,
        isPulling: false,
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh error:', error);
      } finally {
        setPullState(prev => ({
          ...prev,
          isRefreshing: false,
          pullDistance: 0,
        }));
      }
    } else {
      setPullState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
      }));
    }
  };

  useEffect(() => {
    if (!isTouchDevice.current) return;

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullState.isPulling, pullState.isRefreshing, disabled]);

  const progress = Math.min(pullState.pullDistance / threshold, 1);
  const shouldShowIndicator = pullState.isPulling || pullState.isRefreshing;

  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence>
        {shouldShowIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center"
            style={{
              marginTop: `${Math.min(pullState.pullDistance, maxPullDistance)}px`,
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200">
              <motion.div
                animate={{
                  rotate: pullState.isRefreshing ? 360 : 0,
                }}
                transition={{
                  duration: pullState.isRefreshing ? 1 : 0.3,
                  repeat: pullState.isRefreshing ? Infinity : 0,
                  ease: "linear",
                }}
                className="relative"
              >
                {pullState.isRefreshing ? (
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                  <motion.div
                    animate={{
                      scale: progress > 0.8 ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: progress > 0.8 ? Infinity : 0,
                    }}
                  >
                    <Icons.redo 
                      className={`w-6 h-6 transition-colors duration-200 ${
                        progress > 0.8 ? 'text-blue-500' : 'text-gray-400'
                      }`}
                      style={{
                        transform: `rotate(${progress * 180}deg)`,
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        className="w-full h-full overflow-auto"
        style={{
          transform: `translateY(${pullState.pullDistance}px)`,
          transition: pullState.isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>

      {/* Pull indicator text */}
      <AnimatePresence>
        {pullState.isPulling && pullState.pullDistance > 20 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 z-40"
          >
            <motion.p
              animate={{
                opacity: progress > 0.8 ? [0.7, 1, 0.7] : 0.7,
              }}
              transition={{
                duration: 1,
                repeat: progress > 0.8 ? Infinity : 0,
              }}
              className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm"
            >
              {progress > 0.8 ? 'Release to refresh' : 'Pull to refresh'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PullToRefresh; 