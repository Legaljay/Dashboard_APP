import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { useCallback } from "react";

export const useTourState = () => {
    const dispatch = useAppDispatch();
    // const showTour = useAppSelector((state) => state.chat.testEmployeeTour);
    
    const closeTour = useCallback(() => {
    //   dispatch(showTestemployeeTour(false));
    }, [dispatch]);
  
    return {
    //   showTour,
      closeTour
    };
  };