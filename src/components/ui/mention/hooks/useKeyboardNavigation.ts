// hooks/useKeyboardNavigation.ts
import { useEffect, useCallback } from "react";
import { Suggestion, SuggestionGroup } from "../mention.type";

export const useKeyboardNavigation = (
  isOpen: boolean,
  suggestionGroups: SuggestionGroup[],
  currentIndex: number,
  onSelect: (suggestion: Suggestion) => void,
  onClose: () => void,
  setIndex: (index: number) => void
) => {
  const getTotalItems = useCallback(() => {
    return suggestionGroups.reduce((acc, group) => acc + group.items.length, 0);
  }, [suggestionGroups]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      const totalItems = getTotalItems();

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setIndex((currentIndex + 1) % totalItems);
          break;
        case "ArrowUp":
          event.preventDefault();
          setIndex((currentIndex - 1 + totalItems) % totalItems);
          break;
        case "Enter":
          event.preventDefault();
          const flatSuggestions = suggestionGroups.flatMap(group => group.items);
          if (currentIndex >= 0 && currentIndex < flatSuggestions.length) {
            onSelect(flatSuggestions[currentIndex]);
          }
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, currentIndex, suggestionGroups, onSelect, onClose, setIndex, getTotalItems]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};