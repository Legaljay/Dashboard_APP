import { FormEvent, KeyboardEvent, memo } from "react";
import { Suggestion } from "./mention.type";
import { Tooltip } from "./Tooltip";

// components/SuggestionItem.tsx
export const SuggestionItem = memo<{
  suggestion: Suggestion;
  isSelected: boolean;
  onSelect: (suggestion: Suggestion) => void;
  index: number;
}>(({ suggestion, isSelected, onSelect, index }) => {
    const itemContent = (
      // eslint-disable-next-line jsx-a11y/aria-props
    <div
      className={`
          flex items-center gap-2 px-4 py-2 cursor-pointer
          ${isSelected ? "bg-blue-100" : "hover:bg-gray-50"}
        `}
      style={{
        borderLeft: suggestion.color
          ? `4px solid ${suggestion.color}`
          : undefined,
      }}
      // role="option"
      aria-selected={isSelected? 'true' : 'false'}
      tabIndex={-1}
    >
      <span className="flex-grow">{suggestion.name}</span>
      {suggestion.tooltip && (
        <span className="text-gray-400 text-sm" aria-hidden="true">
          ℹ️
        </span>
      )}
    </div>
  );

  const handleSelect = () => {
    onSelect(suggestion);
  };

  const handleKeyDownSelect = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key === "Enter") {
      handleSelect();
    }
  };

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
      <div onKeyDown={handleKeyDownSelect} onClick={handleSelect}>
        {itemContent}
      </div>
    </Tooltip>
  ) : (
    <div onKeyDown={handleKeyDownSelect} onClick={handleSelect}>
      {itemContent}
    </div>
  );
});

SuggestionItem.displayName = "SuggestionItem";
