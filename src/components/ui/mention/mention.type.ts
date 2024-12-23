import { Dispatch, RefObject, SetStateAction } from 'react';

export type Suggestion = {
    id: string;
    name: string;
    color?: string;
    tooltip?: {
      title?: string;
      description?: string;
    };
    groupId?: string;
  };
  
  export type SuggestionGroup = {
    groupName: string;
    items: Suggestion[];
  };
  
  export interface MentionEditorProps {
    value: string;
    onChange: (value: string) => void;
    onMention?: (mention: Suggestion) => void;
    getSuggestions?: (query: string) => Promise<SuggestionGroup[]>;
    mentionTrigger?: string;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    debounceMs?: number;
    maxSuggestions?: number;
    disabled?: boolean;
    ariaLabel?: string;
  }
  
  export interface MentionState {
    isOpen: boolean;
    query: string;
    index: number;
    position: {
      top: number;
      left: number;
    };
  }

  export interface SuggestionContextValue {
    selectedIndex: number;
    setSelectedIndex: Dispatch<SetStateAction<number>>;
    onSelect: (suggestion: Suggestion) => void;
    highlightedIndex: number;
    setHighlightedIndex: Dispatch<SetStateAction<number>>;
    virtualListRef: React.RefObject<HTMLDivElement>;
  }
  
  export interface SuggestionListProps {
    groups: SuggestionGroup[];
    selectedIndex: number;
    onSelect: (suggestion: Suggestion) => void;
    position: { top: number; left: number };
    maxHeight?: number;
    width?: number;
    virtualListRef?: RefObject<HTMLDivElement>;
  }
  
  export interface SuggestionItemProps {
    suggestion: Suggestion;
    isSelected: boolean;
    isHighlighted: boolean;
    onSelect: (suggestion: Suggestion) => void;
    // onSelect: () => void;
    onHover: () => void;
    index: number;
  }