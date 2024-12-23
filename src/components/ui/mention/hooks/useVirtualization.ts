// hooks/useVirtualization.ts
import { useState, useRef, useCallback } from 'react';

interface VirtualizationConfig {
  itemHeight: number;
  overscan?: number;
  containerHeight: number;
}

export const useVirtualization = <T extends any>({
  items,
  itemHeight,
  overscan = 3,
  containerHeight,
}: VirtualizationConfig & { items: T[] }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems = items.slice(startIndex, endIndex).map((item, index) => ({
    item,
    index: startIndex + index,
    offsetTop: (startIndex + index) * itemHeight,
  }));

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    visibleItems,
    virtualItems,
    totalHeight,
    handleScroll,
  };
};
