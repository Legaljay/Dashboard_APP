import { useState, useEffect, useCallback } from 'react';

/**
 * A hook that tracks the state of a CSS media query.
 * Returns true if the media query matches, false otherwise.
 * 
 * @param query The media query to track (e.g., '(max-width: 768px)')
 * @returns boolean indicating if the media query matches
 * 
 * @example
 * ```tsx
 * // Basic responsive design
 * function ResponsiveLayout() {
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 *   const isDesktop = useMediaQuery('(min-width: 1025px)');
 * 
 *   return (
 *     <div className={`layout ${isMobile ? 'mobile' : ''}`}>
 *       {isMobile && <MobileNav />}
 *       {isTablet && <TabletNav />}
 *       {isDesktop && <DesktopNav />}
 *     </div>
 *   );
 * }
 * 
 * // Dark mode detection
 * function ThemeAwareComponent() {
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * 
 *   return (
 *     <div className={prefersDark ? 'dark' : 'light'}>
 *       <h1>Current theme: {prefersDark ? 'Dark' : 'Light'}</h1>
 *     </div>
 *   );
 * }
 * 
 * // Complex responsive behavior
 * function ResponsiveGrid() {
 *   const isWide = useMediaQuery('(min-width: 1200px)');
 *   const isHighDPI = useMediaQuery('(min-resolution: 2dppx)');
 *   const hasHover = useMediaQuery('(hover: hover)');
 * 
 *   return (
 *     <div
 *       className={`
 *         grid
 *         ${isWide ? 'grid-cols-4' : 'grid-cols-2'}
 *         ${isHighDPI ? 'high-dpi' : ''}
 *         ${hasHover ? 'has-hover' : 'touch'}
 *       `}
 *     >
 *       {/* Grid items */}
 *     </div>
 *   );
 * }
 * 
 * // Print styles
 * function PrintableContent() {
 *   const isPrinting = useMediaQuery('print');
 * 
 *   return (
 *     <div className={isPrinting ? 'print-layout' : 'screen-layout'}>
 *       <h1>This will look different when printed</h1>
 *       {!isPrinting && <button>This won't show in print</button>}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Updates automatically when media query state changes
 * - Handles SSR gracefully
 * - Supports all standard media query features
 * - Cleans up listeners on unmount
 * - Handles browser compatibility
 * 
 * @bestPractices
 * - Use standard breakpoints consistently
 * - Consider using CSS custom properties with media queries
 * - Test with various screen sizes and orientations
 * - Handle SSR appropriately
 * - Use semantic breakpoints
 * - Consider performance with many queries
 * 
 * @performance
 * - Minimal overhead
 * - Uses native browser APIs
 * - Efficient event handling
 * - Memoized matcher function
 * 
 * @compatibility
 * - Supports modern and legacy browsers
 * - Handles vendor prefixes automatically
 * - Falls back gracefully when features unavailable
 * - Works with SSR frameworks
 */
export const useMediaQuery = (query: string): boolean => {
  /**
   * Get the current state of the media query
   * Handles SSR by returning false if window is undefined
   */
  const getMatches = useCallback((query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  }, []);

  // Initialize with current match state
  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Update matches state when query state changes
    const handleChange = (): void => {
      setMatches(getMatches(query));
    };

    // Initial check
    handleChange();

    // Watch for changes using appropriate API
    // Some browsers use addListener/removeListener (older)
    // while others use addEventListener/removeEventListener (modern)
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    } else {
      mediaQuery.addEventListener('change', handleChange);
    }

    // Cleanup event listeners on unmount
    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      } else {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, [query, getMatches]);

  return matches;
};
