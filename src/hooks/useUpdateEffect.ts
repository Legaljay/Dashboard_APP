import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

/**
 * A hook that works like useEffect but skips the first render/mount.
 * Useful for effects that should only run on updates, not initial mount.
 * 
 * @param effect Callback function to run on updates
 * @param deps Optional array of dependencies
 * 
 * @example
 * ```tsx
 * // Form validation on update
 * function RegistrationForm() {
 *   const [formData, setFormData] = useState({
 *     username: '',
 *     email: '',
 *     password: ''
 *   });
 *   const [errors, setErrors] = useState({});
 * 
 *   // Only validate when form data changes, not on mount
 *   useUpdateEffect(() => {
 *     const validationErrors = validateForm(formData);
 *     setErrors(validationErrors);
 *   }, [formData]);
 * 
 *   return (
 *     <form>
 *       <input
 *         value={formData.username}
 *         onChange={e => setFormData(prev => ({
 *           ...prev,
 *           username: e.target.value
 *         }))}
 *       />
 *       {errors.username && (
 *         <span className="error">{errors.username}</span>
 *       )}
 *       // Other form fields 
 *     </form>
 *   );
 * }
 * 
 * // API call on filter change
 * function FilteredList() {
 *   const [filters, setFilters] = useState({
 *     category: 'all',
 *     sortBy: 'date'
 *   });
 *   const [items, setItems] = useState([]);
 * 
 *   // Skip initial API call, only fetch when filters change
 *   useUpdateEffect(() => {
 *     fetchFilteredItems(filters).then(setItems);
 *   }, [filters]);
 * 
 *   return (
 *     <div>
 *       <FilterControls
 *         value={filters}
 *         onChange={setFilters}
 *       />
 *       <ItemList items={items} />
 *     </div>
 *   );
 * }
 * 
 * // Sync with external state
 * function ExternalStateSync() {
 *   const [localState, setLocalState] = useState(initialState);
 * 
 *   // Only sync with external state after initial render
 *   useUpdateEffect(() => {
 *     externalStateManager.update(localState);
 *   }, [localState]);
 * 
 *   return (
 *     <StateEditor
 *       value={localState}
 *       onChange={setLocalState}
 *     />
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Skips effect on mount
 * - Runs on all subsequent updates
 * - Supports cleanup function
 * - Follows useEffect dependency rules
 * - Preserves effect execution order
 * 
 * @bestPractices
 * - Use for update-only side effects
 * - Provide complete dependency array
 * - Handle cleanup properly
 * - Consider race conditions
 * - Document skipped initial effect
 * 
 * @performance
 * - Minimal mount overhead
 * - No unnecessary effect runs
 * - Efficient dependency checking
 * - Proper cleanup timing
 * - Memory leak prevention
 * 
 * @caveats
 * - Not for initialization logic
 * - May miss important mount effects
 * - Strict mode compatible
 * - Async effects need cleanup
 * - Server-side rendering safe
 */
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  // Track first mount
  const isFirstMount = useRef(true);

  // Run effect only after first mount
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    return effect();
  }, deps);
}
