// components/suggestions/SuggestionContext.tsx
import { createContext, useContext, useRef, useState, ReactNode } from 'react';
import { Suggestion, SuggestionContextValue } from '../mention.type';

const SuggestionContext = createContext<SuggestionContextValue | undefined>(undefined);

export const SuggestionProvider: React.FC<{
  selectedIndex: number;
  onSelect: (suggestion: Suggestion) => void;
  children: ReactNode;
}> = ({ selectedIndex: initialSelectedIndex, onSelect, children }) => {
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const virtualListRef = useRef<HTMLDivElement>(null);

  

  return (
    <SuggestionContext.Provider
      value={{
        selectedIndex,
        setSelectedIndex,
        onSelect,
        highlightedIndex,
        setHighlightedIndex,
        virtualListRef,
      }}
    >
      {children}
    </SuggestionContext.Provider>
  );
};

export const useSuggestion = () => {
  const context = useContext(SuggestionContext);
  if (!context) {
    throw new Error('useSuggestion must be used within SuggestionProvider');
  }
  return context;
};