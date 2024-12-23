import { useState, useMemo, useCallback } from 'react';

/**
 * Props for configuring the pagination hook
 */
interface UsePaginationProps {
  /** Total number of items to paginate */
  totalItems: number;
  /** Initial page number (default: 1) */
  initialPage?: number;
  /** Number of items to display per page (default: 10) */
  itemsPerPage?: number;
}

/**
 * Return type for the pagination hook
 */
interface UsePaginationReturn {
  /** Current active page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Number of items displayed per page */
  itemsPerPage: number;
  /** Starting index of current page */
  startIndex: number;
  /** Ending index of current page */
  endIndex: number;
  /** Function to navigate to next page */
  nextPage: () => void;
  /** Function to navigate to previous page */
  previousPage: () => void;
  /** Function to navigate to a specific page */
  goToPage: (page: number) => void;
  /** Function to update items per page */
  setItemsPerPage: (count: number) => void;
  /** Array of indices for current page items */
  pageItems: number[];
}

/**
 * A hook for managing pagination state and logic in lists or tables.
 * Handles page navigation, items per page, and provides derived pagination data.
 * 
 * @param props Configuration options for pagination
 * @returns Object containing pagination state and control functions
 * 
 * @example
 * ```tsx
 * // Basic table pagination
 * function DataTable() {
 *   const {
 *     currentPage,
 *     totalPages,
 *     pageItems,
 *     nextPage,
 *     previousPage,
 *     goToPage
 *   } = usePagination({
 *     totalItems: data.length,
 *     itemsPerPage: 10
 *   });
 * 
 *   return (
 *     <div>
 *       <table>
 *         <tbody>
 *           {pageItems.map(index => (
 *             <tr key={index}>
 *               <td>{data[index].name}</td>
 *               <td>{data[index].email}</td>
 *             </tr>
 *           ))}
 *         </tbody>
 *       </table>
 *       <Pagination
 *         currentPage={currentPage}
 *         totalPages={totalPages}
 *         onNext={nextPage}
 *         onPrevious={previousPage}
 *         onPageSelect={goToPage}
 *       />
 *     </div>
 *   );
 * }
 * 
 * // Dynamic items per page
 * function ProductGrid() {
 *   const {
 *     pageItems,
 *     itemsPerPage,
 *     setItemsPerPage,
 *     currentPage,
 *     totalPages,
 *     goToPage
 *   } = usePagination({
 *     totalItems: products.length,
 *     initialPage: 1,
 *     itemsPerPage: 12
 *   });
 * 
 *   return (
 *     <div>
 *       <select
 *         value={itemsPerPage}
 *         onChange={(e) => setItemsPerPage(Number(e.target.value))}
 *       >
 *         <option value={12}>12 per page</option>
 *         <option value={24}>24 per page</option>
 *         <option value={48}>48 per page</option>
 *       </select>
 * 
 *       <div className="grid">
 *         {pageItems.map(index => (
 *           <ProductCard
 *             key={products[index].id}
 *             product={products[index]}
 *           />
 *         ))}
 *       </div>
 * 
 *       <PaginationControls
 *         current={currentPage}
 *         total={totalPages}
 *         onChange={goToPage}
 *       />
 *     </div>
 *   );
 * }
 * 
 * // Infinite scroll pagination
 * function InfiniteList() {
 *   const {
 *     pageItems,
 *     nextPage,
 *     currentPage,
 *     totalPages
 *   } = usePagination({
 *     totalItems: items.length,
 *     itemsPerPage: 20
 *   });
 * 
 *   const lastItemRef = useIntersectionObserver(() => {
 *     if (currentPage < totalPages) {
 *       nextPage();
 *     }
 *   });
 * 
 *   return (
 *     <div className="list">
 *       {pageItems.map((index, i) => (
 *         <div
 *           key={items[index].id}
 *           ref={i === pageItems.length - 1 ? lastItemRef : null}
 *         >
 *           {items[index].content}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Handles boundary conditions
 * - Maintains consistent state
 * - Provides derived calculations
 * - Supports dynamic updates
 * - Zero-based indexing internally
 * 
 * @bestPractices
 * - Use appropriate page sizes
 * - Handle loading states
 * - Implement error boundaries
 * - Cache paginated data
 * - Preserve page on navigation
 * - Consider mobile viewports
 * 
 * @performance
 * - Memoized calculations
 * - Efficient state updates
 * - Minimal re-renders
 * - Optimized page transitions
 * - Smart index management
 * 
 * @accessibility
 * - Keyboard navigation
 * - Screen reader support
 * - Focus management
 * - ARIA attributes
 * - Announcement of changes
 */
export const usePagination = ({
  totalItems,
  initialPage = 1,
  itemsPerPage: initialItemsPerPage = 10,
}: UsePaginationProps): UsePaginationReturn => {
  // Current page state (1-based for user interface)
  const [currentPage, setCurrentPage] = useState(initialPage);
  // Items per page state
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Calculate total pages based on items and page size
  const totalPages = useMemo(() => Math.ceil(totalItems / itemsPerPage), [totalItems, itemsPerPage]);

  // Calculate start and end indices for current page
  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
  const endIndex = useMemo(() => Math.min(startIndex + itemsPerPage, totalItems), [startIndex, itemsPerPage, totalItems]);

  // Navigate to next page if available
  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  // Navigate to previous page if available
  const previousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  // Navigate to specific page with bounds checking
  const goToPage = useCallback((page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  // Update items per page and reset to first page
  const updateItemsPerPage = useCallback((count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1); // Reset to first page when changing items per page
  }, []);

  // Generate array of indices for current page items
  const pageItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push(i);
    }
    return items;
  }, [startIndex, endIndex]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    nextPage,
    previousPage,
    goToPage,
    setItemsPerPage: updateItemsPerPage,
    pageItems,
  };
};
