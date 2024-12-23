// components/suggestions/SuggestionGroup.tsx
import { memo } from 'react';
import { Suggestion, SuggestionGroup } from '../mention.type';

interface SuggestionGroupProps {
  group: SuggestionGroup;
  startIndex: number;
  renderItem: (suggestion: Suggestion, index: number) => React.ReactNode;
}

export const SuggestionGroupFc = memo<SuggestionGroupProps>(({
  group,
  startIndex,
  renderItem,
}) => {
  return (
    <div role="group" aria-label={group.groupName}>
      <div className="sticky top-0 px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-600 z-10">
        {group.groupName}
      </div>
      {group.items.map((suggestion, idx) => renderItem(suggestion, startIndex + idx))}
    </div>
  );
});

SuggestionGroupFc.displayName = 'SuggestionGroup';