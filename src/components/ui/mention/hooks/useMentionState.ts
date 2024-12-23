// hooks/useMentionState.ts
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { MentionState, SuggestionGroup } from "../mention.type";

export const useMentionState = (
  getSuggestions?: (query: string) => Promise<SuggestionGroup[]>,
  debounceMs = 300
) => {
  const [suggestionGroups, setSuggestionGroups] = useState<SuggestionGroup[]>([]);
  const [mentionState, setMentionState] = useState<MentionState>({
    isOpen: false,
    query: "",
    index: 0,
    position: { top: 0, left: 0 },
  });

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!getSuggestions) return;
      try {
        const results = await getSuggestions(query);
        setSuggestionGroups(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestionGroups([]);
      }
    }, debounceMs),
    [getSuggestions, debounceMs]
  );

  return {
    suggestionGroups,
    mentionState,
    setMentionState,
    fetchSuggestions,
  };
};