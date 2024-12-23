// components/suggestions/SuggestionItem.tsx
import { memo, useCallback } from 'react';
import { Tooltip } from '../Tooltip';
import { cn } from '@/lib/utils';
import { SuggestionItemProps } from '../mention.type';

export const SuggestionItem = memo<SuggestionItemProps>(({
  suggestion,
  isSelected,
  isHighlighted,
  onSelect,
  onHover,
  index,
}) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(suggestion);
    }
  }, [onSelect]);

  const itemContent = (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors',
        'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
        isSelected && 'bg-blue-100',
        isHighlighted && 'bg-gray-50'
      )}
      style={{
        borderLeft: suggestion.color ? `4px solid ${suggestion.color}` : undefined,
      }}
    //   role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={onHover}
      onClick={() => onSelect(suggestion)}
      data-testid={`suggestion-item-${index}`}
    >
      <span className="flex-grow truncate">{suggestion.name}</span>
      {suggestion.tooltip && (
        <span 
          className="text-gray-400 text-sm flex-shrink-0" 
          aria-hidden="true"
        >
          ℹ️
        </span>
      )}
    </div>
  );

  return suggestion.tooltip ? (
    <Tooltip
      content={
        <div className="flex flex-col gap-1">
          {suggestion.tooltip.title && (
            <div className="font-semibold">{suggestion.tooltip.title}</div>
          )}
          {suggestion.tooltip.description && (
            <div className="text-gray-200 text-xs">
              {suggestion.tooltip.description}
            </div>
          )}
        </div>
      }
    >
      {itemContent}
    </Tooltip>
  ) : (
    itemContent
  );
});

SuggestionItem.displayName = 'SuggestionItem';