// components/suggestions/VirtualList.tsx
import { memo, useMemo, useRef } from 'react';
import { useVirtual } from '../hooks/useVirtual';

interface VirtualListProps {
  items: any[];
  renderItem: (index: number) => React.ReactNode;
  itemHeight: number;
  overscan?: number;
  maxHeight?: number;
}

export const VirtualList: React.FC<VirtualListProps> = ({
  items,
  renderItem,
  itemHeight,
  overscan = 5,
  maxHeight = 300,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef,
    estimateSize: () => itemHeight,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      className="overflow-auto"
      style={{ height: `${Math.min(items.length * itemHeight, maxHeight)}px` }}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow: any) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${itemHeight}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {renderItem(virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
};



import { useVirtualization } from '../hooks/useVirtualization';
import { Suggestion, SuggestionGroup } from '../mention.type';
import { SuggestionItem } from '../SuggestionItem';


const ITEM_HEIGHT = 40; // Height of each suggestion item in pixels
const CONTAINER_HEIGHT = 300; // Max height of suggestion container

interface VirtualizedSuggestionListProps {
  groups: SuggestionGroup[];
  selectedIndex: number;
  onSelect: (suggestion: Suggestion) => void;
  position: { top: number; left: number };
}

export const VirtualizedSuggestionList = memo<VirtualizedSuggestionListProps>(({
  groups,
  selectedIndex,
  onSelect,
  position,
}) => {
  // Flatten groups and items for virtualization
  const flatItems = useMemo(() => {
    const items: Array<{
      type: 'group' | 'item';
      data: SuggestionGroup | Suggestion;
      groupIndex?: number;
      itemIndex?: number;
    }> = [];

    groups.forEach((group, groupIndex) => {
      items.push({ type: 'group', data: group });
      group.items.forEach((item, itemIndex) => {
        items.push({ 
          type: 'item', 
          data: item, 
          groupIndex, 
          itemIndex 
        });
      });
    });

    return items;
  }, [groups]);

  const {
    containerRef,
    virtualItems,
    totalHeight,
    handleScroll,
  } = useVirtualization({
    items: flatItems,
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5,
  });

  return (
    <div
      className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-64 overflow-hidden"
      style={{ top: position.top, left: position.left }}
    //   role="listbox"
      aria-label="Suggestions"
    >
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: Math.min(CONTAINER_HEIGHT, totalHeight) }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {virtualItems.map(({ item: virtualItem, offsetTop }) => (
            <div
              key={virtualItem.type === 'group' && 'groupName' in virtualItem.data 
                ? virtualItem.data.groupName 
                : (virtualItem.data as Suggestion).id}
              style={{
                position: 'absolute',
                top: offsetTop,
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
              }}
            >
              {virtualItem.type === 'group' ? (
                <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-600">
                  {(virtualItem.data as SuggestionGroup).groupName}
                </div>
              ) : (
                <SuggestionItem
                  suggestion={virtualItem.data as Suggestion}
                  isSelected={selectedIndex === virtualItem.itemIndex}
                  onSelect={onSelect}
                  index={virtualItem.itemIndex!}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

VirtualizedSuggestionList.displayName = 'VirtualizedSuggestionList';