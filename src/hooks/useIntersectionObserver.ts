import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Configuration options for the Intersection Observer
 */
interface IntersectionObserverOptions {
  /** The element that is used as the viewport for checking visibility of the target */
  root?: Element | null;
  /** Margin around the root element */
  rootMargin?: string;
  /** Either a single number or an array of numbers between 0.0 and 1.0 */
  threshold?: number | number[];
  /** Callback function that is triggered when intersection occurs */
  onIntersect?: () => void;
}

/**
 * A hook that wraps the IntersectionObserver API to detect when an element enters the viewport.
 * Useful for implementing infinite scroll, lazy loading images, or triggering animations.
 * 
 * @param options Configuration options for the Intersection Observer
 * @returns Object containing:
 *   - targetRef: Ref to attach to the target element
 *   - isIntersecting: Whether the target element is currently intersecting
 * 
 * @example
 * ```tsx
 * // Infinite scroll
 * function InfiniteList() {
 *   const [items, setItems] = useState<Item[]>([]);
 *   const [page, setPage] = useState(1);
 *   
 *   const { targetRef, isIntersecting } = useIntersectionObserver({
 *     threshold: 0.5,
 *     onIntersect: () => {
 *       setPage(prev => prev + 1);
 *     },
 *   });
 * 
 *   useEffect(() => {
 *     fetchItems(page).then(newItems => {
 *       setItems(prev => [...prev, ...newItems]);
 *     });
 *   }, [page]);
 * 
 *   return (
 *     <div>
 *       {items.map(item => (
 *         <ListItem key={item.id} item={item} />
 *       ))}
 *       <div ref={targetRef}>
 *         {isIntersecting && <LoadingSpinner />}
 *       </div>
 *     </div>
 *   );
 * }
 * 
 * // Lazy loading images
 * function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   const [isLoaded, setIsLoaded] = useState(false);
 *   const { targetRef, isIntersecting } = useIntersectionObserver({
 *     threshold: 0.1,
 *     rootMargin: '50px',
 *   });
 * 
 *   useEffect(() => {
 *     if (isIntersecting && !isLoaded) {
 *       setIsLoaded(true);
 *     }
 *   }, [isIntersecting]);
 * 
 *   return (
 *     <div ref={targetRef}>
 *       {isLoaded ? (
 *         <img src={src} alt={alt} />
 *       ) : (
 *         <div className="placeholder" />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Uses the native IntersectionObserver API
 * - Automatically cleans up observer on unmount
 * - Supports all IntersectionObserver options
 * - Handles observer reconnection when options change
 * 
 * @bestPractices
 * - Set appropriate threshold based on use case
 *   - 0 for infinite scroll (fully out of view)
 *   - 0.1-0.2 for lazy loading (partially in view)
 *   - 0.5-1.0 for animations (mostly/fully in view)
 * - Use rootMargin to start loading earlier
 * - Consider device performance when setting threshold array
 * - Clean up async operations in onIntersect callback
 * 
 * @performance
 * - Observer is created only once per instance
 * - Callback is memoized to prevent unnecessary observer recreation
 * - Single observer instance can be reused for multiple elements
 * - Minimal impact on main thread compared to scroll listeners
 */
export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  onIntersect,
}: IntersectionObserverOptions = {}) {
  // Track intersection state
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  // Refs for the target element and observer instance
  const targetRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoized callback to handle intersection changes
  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsIntersecting(entry.isIntersecting);

    if (entry.isIntersecting && onIntersect) {
      onIntersect();
    }
  }, [onIntersect]);

  // Set up and clean up the observer
  useEffect(() => {
    if (!targetRef.current) return;

    // Create new observer with current options
    observerRef.current = new IntersectionObserver(callback, {
      root,
      rootMargin,
      threshold,
    });

    // Start observing the target element
    observerRef.current.observe(targetRef.current);

    // Clean up observer on unmount or when options change
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, root, rootMargin, threshold]);

  return {
    targetRef,
    isIntersecting,
  };
}
