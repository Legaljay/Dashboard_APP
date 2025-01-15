import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { AuthLayoutWrapper } from "./auth";
import ErrorBoundary from "../ErrorBoundary";
import RootLayout from "../RootLayout";
import NotFound from "../NotFound";
import DashboardLayoutWrapper from "./dashboard";
import TokenService from "../utils/token";
import GetStartedDashboard from "./auth/get-started/components/GetStartedDashboard";
import Billing from "./dashboard/billing";
import { Navigate } from "react-router-dom";
import ConversationLayout from "./dashboard/conversation";


// Auth Routes
const LoginForm = lazy(() => import("./auth/login/Login"));
const SignupForm = lazy(() => import("./auth/signup/Signup"));
const Verification = lazy(() => import("./auth/verify/Verification"));
const CompanyDetails = lazy(() => import("./auth/company-details/CompanyDetails"));
const ForgotPassword = lazy(() => import("./auth/forgot-password/ForgotPassword"));
const ResetPassword = lazy(() => import("./auth/reset-password/ResetPassword"));
const ResetOtp = lazy(() => import("./auth/reset-otp/components/ResetOtp"));
const UseWano = lazy(() => import("./auth/use-wano/components/UseWano"));
const GetStarted = lazy(() => import("./auth/get-started/components/GetStarted"));
const TwoFactorAuthentication = lazy(() => import("./auth/2fa/components/TwoFactorAuthentication"));
const TwoFAC = lazy(() => import("./auth/2fa/components/TwoFAC"));
const CustomizeAssistant = lazy(() => import("./auth/customize-assistant/CustomizeAssistant"));
const AuthDashboard = lazy(() => import("./AuthDashboard"));

// Dashboard Routes
const DashboardLayout = lazy(() => import("./dashboard/DashboardLayout"));
const Dashboard = lazy(() => import("./dashboard/dashboard"));
const CustomerRoutes = lazy(() => import("./dashboard/customer"));
const Customers = lazy(() => import("./dashboard/customers"));
const Wallet = lazy(() => import("./dashboard/wallet/components/Wallet"));
const Support = lazy(() => import("./dashboard/support"));
const AskAssistant = lazy(() => import("./dashboard/ask-assistant"));
const Analytics = lazy(() => import("./dashboard/analytics"));
// Assistant Routes
const AssistantLayout = lazy(() => import("./dashboard/assistant/components/Layout/AssistantLayout"));
const Assistant = lazy(() => import("./dashboard/assistant/components/Assistant"));
const Widget = lazy(() => import("./dashboard/assistant/components/Widget"));
const Settings = lazy(() => import("./dashboard/settings"));
const ManagePlan = lazy(() => import("./dashboard/billing/components/ManagePlan"));
const Invitation = lazy(() => import("./dashboard/assistant/components/Invitation"));
const CreateFeature = lazy(() => import("./dashboard/assistant/components/CreateFeature"));
const Deploy = lazy(() => import("./dashboard/assistant/components/Deploy"));
// App Store Routes
const AppStore = lazy(() => import("./dashboard/appstore/components/AppStore"));
const AppType = lazy(() => import("./dashboard/appstore/components/AppType"));
const AllAppType = lazy(() => import("./dashboard/appstore/components/AllAppType"));
const OtherApps = lazy(() => import("./dashboard/appstore/components/OtherApps"));

export const routes: RouteObject[] = [
  {
    path: "/*",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth" replace />,
      },
      {
        path: "auth/*",
        element: <AuthLayoutWrapper />,
        children: [
          {
            index: true,
            element: <LoginForm />,
          },
          {
            path: "signup",
            element: <SignupForm />,
          },
          {
            path: "verify-account",
            element: <Verification />,
          },
          {
            path: "reset-verify",
            element: <ResetOtp />,
          },
          {
            path: "2Fa-Authentication",
            element: <TwoFactorAuthentication />,
          },
          {
            path: "company",
            element: <CompanyDetails />,
          },
          {
            path: "reset-password",
            element: <ResetPassword />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "accept-invite",
            element: <Invitation />,
          },
          {
            path: "customize-assistant/:businessId",
            element: <CustomizeAssistant />,
          },
        ],
      },
      {
        path: "dashboard/*",
        element: <DashboardLayoutWrapper />,
        loader: async () => {
          // Check if the user is authenticated
          const token = TokenService.getToken();
          if (!token) {
            window.location.href = "/";
            throw new Error("Authentication required");
          }
          return token;
        },
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "*",
            element: <NotFound/>
          },
          {
            path: "assistant/*",
            children: [
              {
                index: true,
                element: <Assistant />,
              },
              {
                path: ":assistantId/*",
                element: <AssistantLayout />,
                errorElement: <ErrorBoundary />,
              },
              {
                path: "create-feature",
                element: <CreateFeature />,
              },
            ],
          },
          {
            path: "deploy/*",
            element: <Deploy />,
          },
          {
            path: "widget/*",
            element: <Widget />,
          },
          {
            path: "ask-assistant/*",
            element: <AskAssistant />,
          },
          {
            path: "analytics/*",
            element: <Analytics />,
          },
          {
            path: "conversations/*",
            element: <ConversationLayout />,
          },
          {
            path: "customers/*",
            element: <CustomerRoutes />,
          },
          {
            path: "settings/*",
            element: <Settings />,
          },
          {
            path: "appstore/*",
            children: [
              {
                index: true,
                element: <AppStore />,
              },
              {
                path: "pluginType/:id/*",
                element: <AppType />,
              },
              {
                path: "AllpluginType/:id/*",
                element: <AllAppType />,
              },
              {
                path: "AllpluginTypes/:name/*",
                element: <OtherApps />,
              },
            ],
          },
          {
            path: "billing/*",
            element: <Billing />,
          },
          {
            path: "support",
            element: <Support />,
          },
        ],
      },
      {
        path: "getstarted/*",
        children: [
          {
            index: true,
            element: <GetStarted />,
          },
          {
            path: "dashboard",
            element: <GetStartedDashboard />,
          },
        ],
      },
      {
        path: "what-will-you-use-wano-for/*",
        element: <UseWano />,
      },
      {
        path: "three-factor-authentic/*",
        element: <TwoFAC />,
      },
    ],
  },
];
