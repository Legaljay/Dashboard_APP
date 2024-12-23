// components/suggestions/SuggestionList.tsx
import { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Suggestion, SuggestionListProps } from '../mention.type';
import { useSuggestion } from './SuggestionContext';
import { SuggestionItem } from './SuggestionItem';
import { cn } from '@/lib/utils';
import { VirtualList } from './VirtualList';

export const SuggestionList: React.FC<SuggestionListProps> = ({
  groups,
  selectedIndex,
  onSelect,
  position,
  maxHeight = 300,
  width = 256,
}) => {
  const { highlightedIndex, setHighlightedIndex } = useSuggestion();

  const flattenedItems = useMemo(() => {
    return groups.flatMap(group => group.items);
  }, [groups]);

  const renderSuggestionItem = useCallback((suggestion: Suggestion, index: number) => {
    const handleSelect = () => onSelect(suggestion);
    const handleHover = () => setHighlightedIndex(index);

    return (
      <SuggestionItem
        key={suggestion.id}
        suggestion={suggestion}
        isSelected={index === selectedIndex}
        isHighlighted={index === highlightedIndex}
        onSelect={handleSelect}
        onHover={handleHover}
        index={index}
      />
    );
  }, [selectedIndex, highlightedIndex, onSelect, setHighlightedIndex]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200',
          'focus-within:ring-2 focus-within:ring-blue-500'
        )}
        style={{
          top: position.top,
          left: position.left,
          width: width,
          maxHeight: maxHeight,
        }}
        role="listbox"
        aria-label="Suggestions"
      >
        <VirtualList
          items={flattenedItems}
          itemHeight={40}
          maxHeight={maxHeight}
          renderItem={(index) => {
            let groupStartIndex = 0;
            for (const group of groups) {
              if (index < groupStartIndex + group.items.length) {
                return renderSuggestionItem(group.items[index - groupStartIndex], index);
              }
              groupStartIndex += group.items.length;
            }
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};