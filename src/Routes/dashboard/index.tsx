import { Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { Suspense, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { TourProvider } from "@/contexts/TourContext";
import { ModalProvider } from "@/contexts/ModalContext";
import {
  // fetchBusinesses,
  // fetchBusinessProfile,
  fetchInitialDashboardData,
} from "@/redux-slice/business/business.slice";
import LoadingSpinner from "@/LoadingFallback";
import { AppProvider } from "@/contexts/AppContext";
// import { fetchApplications } from "@/redux-slice/applications/applications.slice";
// import { fetchNotifications } from "@/redux-slice/notifications/notifications.slice";
// import { fetchUserProfile } from "@/redux-slice/user/user.slice";
// import { useUpdateEffect } from "@/hooks/useUpdateEffect";

const LoadingFallback = () => (
  <div className="flex justify-center items-center w-full h-full">
    <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin" />
  </div>
);

// Dashboard Layout wrapper
const DashboardLayoutWrapper = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.auth);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (!initialFetchDone.current) {
      // Fetch all initial data in parallel
      dispatch(fetchInitialDashboardData());
      initialFetchDone.current = true;
    }
  }, [dispatch]);

  return (
    <AppProvider>
      <TourProvider>
        <ModalProvider>
          <DashboardLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet context={{ state }} />
            </Suspense>
          </DashboardLayout>
        </ModalProvider>
      </TourProvider>
    </AppProvider>
  );
};

export default DashboardLayoutWrapper;
