import { useState, useCallback } from 'react';
import { useLocation } from 'react-router';
import { ClickState } from '../types';

const initialState: ClickState = {
  Pricing: false,
  Faqs: false,
  Contact_Us: false,
  Speak_with_CEO: false,
};

export const useInitialState = () => {
  const { state } = useLocation();
  const hereClicked = sessionStorage.getItem("here");
  
  // Initialize state with location state or handle "here" click
  const [clickItem, setClickItem] = useState<ClickState>(() => {
    if (state) {
      return { ...initialState, ...state };
    }
    if (hereClicked) {
      return { ...initialState, Pricing: true };
    }
    return initialState;
  });

  const handleCheckboxChange = useCallback(
    (clickItemName: keyof ClickState) => {
      setClickItem((prev) => {
        const updatedClickItem = Object.keys(prev).reduce(
          (acc, item) => ({
            ...acc,
            [item]:
              item === clickItemName ? !prev[item as keyof ClickState] : false,
          }),
          {} as ClickState
        );
        return updatedClickItem;
      });
    },
    []
  );

  return {
    clickItem,
    handleCheckboxChange,
  };
};
