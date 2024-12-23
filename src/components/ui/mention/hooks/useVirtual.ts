import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface VirtualItem {
  index: number;
  start: number;
  size: number;
}

interface VirtualListState {
  totalSize: number;
  virtualItems: VirtualItem[];
  visibleRange: { start: number; end: number };
}

interface UseVirtualOptions {
  size: number;
  parentRef: React.RefObject<HTMLElement>;
  estimateSize: (index: number) => number;
  overscan?: number;
}

export function useVirtual({
  size,
  parentRef,
  estimateSize,
  overscan = 5,
}: UseVirtualOptions): VirtualListState {
  const cache = useRef<Map<number, number>>(new Map());

  const getSize = useCallback(
    (index: number) => {
      if (cache.current.has(index)) {
        return cache.current.get(index)!;
      }

      const size = estimateSize(index);
      cache.current.set(index, size);
      return size;
    },
    [estimateSize]
  );

  const totalSize = useMemo(() => {
    let total = 0;
    for (let i = 0; i < size; i++) {
      total += getSize(i);
    }
    return total;
  }, [size, getSize]);

  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];
    let start = 0;
    for (let i = 0; i < size; i++) {
      const size = getSize(i);
      items.push({ index: i, start, size });
      start += size;
    }
    return items;
  }, [size, getSize]);

  const scrollHeight = useMemo(() => totalSize, [totalSize]);

  const getVisibleRange = useCallback(() => {
    if (!parentRef.current) return { start: 0, end: 0 };

    const parentRect = parentRef.current.getBoundingClientRect();
    const scrollTop = parentRef.current.scrollTop;
    const fromTop = scrollTop;
    const fromBottom = scrollTop + parentRect.height;

    let start = 0;
    let end = 0;
    let runningTotal = 0;
    for (const item of virtualItems) {
      runningTotal += item.size;
      if (runningTotal >= fromTop - item.size * overscan) {
        start = item.index;
        break;
      }
    }

    runningTotal = 0;
    for (const item of virtualItems) {
      runningTotal += item.size;
      if (runningTotal >= fromBottom + item.size * overscan) {
        end = item.index;
        break;
      }
    }

    return { start, end };
  }, [parentRef, virtualItems, overscan]);

  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  useEffect(() => {
    if (!parentRef.current) return;

    const handleScroll = () => {
      setVisibleRange(getVisibleRange());
    };

    parentRef.current.addEventListener('scroll', handleScroll);
    return () => {
      if (parentRef.current) {
        parentRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [parentRef, getVisibleRange]);

  return { totalSize: scrollHeight, virtualItems, visibleRange };
}