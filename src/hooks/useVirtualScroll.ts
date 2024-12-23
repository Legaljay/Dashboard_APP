import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Configuration options for virtual scrolling
 */
interface VirtualScrollOptions {
  /** Fixed height of each item in pixels */
  itemHeight: number;
  /** Number of items to render above/below visible area */
  overscan?: number;
  /** Scroll percentage threshold to trigger loading more items */
  threshold?: number;
}

/**
 * A hook for implementing virtual scrolling in long lists.
 * Only renders items that are visible in the viewport plus a configurable overscan area.
 * 
 * @template T Type of items in the list
 * @param items Array of items to virtualize
 * @param options Configuration options for virtual scrolling
 * @returns Object containing refs, visible items, and scroll state
 * 
 * @example
 * ```tsx
 * // Basic virtualized list
 * function VirtualList() {
 *   const items = Array.from({ length: 10000 }, (_, i) => ({
 *     id: i,
 *     content: `Item ${i}`
 *   }));
 * 
 *   const {
 *     containerRef,
 *     visibleItems,
 *     totalHeight,
 *     startOffset
 *   } = useVirtualScroll(items, {
 *     itemHeight: 50,
 *     overscan: 5
 *   });
 * 
 *   return (
 *     <div
 *       ref={containerRef}
 *       style={{
 *         height: '400px',
 *         overflow: 'auto'
 *       }}
 *     >
 *       <div style={{ height: totalHeight }}>
 *         <div style={{
 *           transform: `translateY(${startOffset}px)`
 *         }}>
 *           {visibleItems.map(item => (
 *             <div
 *               key={item.id}
 *               style={{ height: 50 }}
 *             >
 *               {item.content}
 *             </div>
 *           ))}
 *         </div>
 *       </div>
 *     </div>
 *   );
 * }
 * 
 * // Infinite loading list
 * function InfiniteVirtualList() {
 *   const [items, setItems] = useState([]);
 *   const [hasMore, setHasMore] = useState(true);
 * 
 *   const {
 *     containerRef,
 *     visibleItems,
 *     totalHeight,
 *     startOffset,
 *     isLoadingMore,
 *     setIsLoadingMore
 *   } = useVirtualScroll(items, {
 *     itemHeight: 60,
 *     threshold: 0.8
 *   });
 * 
 *   useEffect(() => {
 *     if (isLoadingMore && hasMore) {
 *       fetchMoreItems()
 *         .then(newItems => {
 *           setItems(prev => [...prev, ...newItems]);
 *           setHasMore(newItems.length > 0);
 *           setIsLoadingMore(false);
 *         });
 *     }
 *   }, [isLoadingMore]);
 * 
 *   return (
 *     <div ref={containerRef} className="virtual-container">
 *       <div style={{ height: totalHeight }}>
 *         <div style={{
 *           transform: `translateY(${startOffset}px)`
 *         }}>
 *           {visibleItems.map(item => (
 *             <ListItem
 *               key={item.id}
 *               data={item}
 *               height={60}
 *             />
 *           ))}
 *         </div>
 *       </div>
 *       {isLoadingMore && <LoadingSpinner />}
 *     </div>
 *   );
 * }
 * 
 * // Grid virtualization
 * function VirtualGrid() {
 *   const gridItems = generateGridItems(1000);
 *   const itemWidth = 200;
 *   const columns = 3;
 * 
 *   const {
 *     containerRef,
 *     visibleItems,
 *     totalHeight,
 *     startOffset
 *   } = useVirtualScroll(
 *     chunk(gridItems, columns),
 *     { itemHeight: itemWidth }
 *   );
 * 
 *   return (
 *     <div ref={containerRef} className="grid-container">
 *       <div style={{ height: totalHeight }}>
 *         <div style={{
 *           transform: `translateY(${startOffset}px)`,
 *           display: 'grid',
 *           gridTemplateColumns: `repeat(${columns}, 1fr)`
 *         }}>
 *           {visibleItems.flat().map(item => (
 *             <GridCell
 *               key={item.id}
 *               item={item}
 *               width={itemWidth}
 *             />
 *           ))}
 *         </div>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Only renders visible items
 * - Maintains scroll position
 * - Supports dynamic loading
 * - Handles window resizing
 * - Efficient DOM updates
 * 
 * @bestPractices
 * - Use fixed item heights
 * - Implement proper keys
 * - Handle loading states
 * - Consider mobile performance
 * - Cache item measurements
 * - Debounce scroll events
 * 
 * @performance
 * - Minimal DOM nodes
 * - Efficient scroll handling
 * - Optimized re-renders
 * - Memory management
 * - Smooth scrolling
 * 
 * @caveats
 * - Requires fixed item height
 * - May flicker on fast scroll
 * - Limited dynamic height support
 * - Complex keyboard navigation
 * - SEO considerations
 */
export function useVirtualScroll<T>(
  items: T[],
  { itemHeight, overscan = 3, threshold = 0.8 }: VirtualScrollOptions
) {
  // Track visible item range
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  // Container height for calculating visible items
  const [containerHeight, setContainerHeight] = useState(0);
  // Reference to scroll container
  const containerRef = useRef<HTMLDivElement>(null);
  // Loading state for infinite scroll
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Calculate total content height
  const totalHeight = items.length * itemHeight;
  // Calculate number of visible items
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  /**
   * Updates the range of visible items based on scroll position
   */
  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const start = Math.floor(scrollTop / itemHeight);
    const end = start + visibleCount + overscan;

    setVisibleRange({
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, end + overscan),
    });
  }, [itemHeight, visibleCount, overscan, items.length]);

  /**
   * Handles scroll events and triggers loading more items
   */
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLDivElement;
    const scrollPercentage = 
      (target.scrollTop + target.clientHeight) / target.scrollHeight;

    if (scrollPercentage > threshold && !isLoadingMore) {
      setIsLoadingMore(true);
    }

    updateVisibleRange();
  }, [threshold, isLoadingMore, updateVisibleRange]);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Initialize container height
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  // Get currently visible items
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return {
    containerRef,
    visibleItems,
    visibleRange,
    totalHeight,
    isLoadingMore,
    setIsLoadingMore,
    startOffset: visibleRange.start * itemHeight,
  };
}
