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
import LoadingSpinner from '@/LoadingFallback';
// import { fetchApplications } from "@/redux-slice/applications/applications.slice";
// import { fetchNotifications } from "@/redux-slice/notifications/notifications.slice";
// import { fetchUserProfile } from "@/redux-slice/user/user.slice";
// import { useUpdateEffect } from "@/hooks/useUpdateEffect";

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
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
    <TourProvider>
      <ModalProvider>
        <DashboardLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet context={{ state }} />
          </Suspense>
        </DashboardLayout>
      </ModalProvider>
    </TourProvider>
  );
};

export default DashboardLayoutWrapper;
