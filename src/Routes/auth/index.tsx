import { ModalProvider } from "@/contexts/ModalContext.tsx";
import LoadingFallback from "@/LoadingFallback.tsx";
import React, { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

export const ResetOtp = lazy(
  () => import("./reset-otp/components/ResetOtp.tsx")
);
export const GetStarted = lazy(
  () => import("./get-started/components/GetStarted")
);
export const CustomizeAssistant = lazy(
  () => import("./customize-assistant/CustomizeAssistant.tsx")
);
export const TwoFAC = lazy(() => import("./2fa/components/TwoFAC"));
export const AuthLayout = lazy(() => import("./AuthLayout"));

// Auth Layout for authentication-related routes
export const AuthLayoutWrapper: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthLayout>
        <ModalProvider>
          <Outlet />
        </ModalProvider>
      </AuthLayout>
    </Suspense>
  );
};
