// hooks/useSuggestionKeyboardNav.ts
import { useEffect, useCallback } from 'react';

interface SuggestionContextValue {
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  virtualListRef: React.RefObject<HTMLDivElement>;
}

export const useSuggestionKeyboardNav = (
  isOpen: boolean,
  totalItems: number,
  onClose: () => void,
  onSelect: (index: number) => void,
  { selectedIndex, setSelectedIndex, virtualListRef }: SuggestionContextValue
) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % totalItems);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < totalItems) {
            onSelect(selectedIndex);
          } else {
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          onClose();
          break;
      }
    },
    [selectedIndex, setSelectedIndex, totalItems, onSelect, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    if (!isOpen || !virtualListRef.current) return;

    const selectedElement = virtualListRef.current.querySelector(
      `[data-testid="suggestion-item-${selectedIndex}"]`
    );

    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isOpen, selectedIndex, virtualListRef]);
};