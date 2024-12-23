// components/SuggestionList.tsx
import { memo } from "react";
import { Suggestion, SuggestionGroup } from "./mention.type";
import { SuggestionItem } from "./SuggestionItem";

interface SuggestionListProps {
  groups: SuggestionGroup[];
  selectedIndex: number;
  onSelect: (suggestion: Suggestion) => void;
  position: { top: number; left: number };
}

export const SuggestionList = memo<SuggestionListProps>(({
  groups,
  selectedIndex,
  onSelect,
  position,
}) => {
  let currentIndex = 0;

  return (
    <div
      className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-64 max-h-[300px] overflow-y-auto"
      style={{ top: position.top, left: position.left }}
    //   role="listbox"
      aria-label="Suggestions"
    >
      {groups.map((group) => (
        <div key={group.groupName} role="group" aria-label={group.groupName}>
          <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-600">
            {group.groupName}
          </div>
          {group.items.map((suggestion) => {
            const isSelected = currentIndex === selectedIndex;
            const itemIndex = currentIndex++;

            return (
              <SuggestionItem
                key={suggestion.id}
                suggestion={suggestion}
                isSelected={isSelected}
                onSelect={onSelect}
                index={itemIndex}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
});

SuggestionList.displayName = "SuggestionList";