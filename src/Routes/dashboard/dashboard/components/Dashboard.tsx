import React, { memo, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
// import { ModalExamples } from "@/components/examples/ModalExamples";
// import { useApp } from "@/contexts/AppContext";
// import useDataFetching from "@/hooks/useDataFetching";
import { DashboardStats as DashStats } from "@/types/common";
import "./Dashboard.css";
import { useAppSelector } from "@/redux-slice/hooks";
import QuickAccess from "./QuickAccess";
import DashboardStats from "./DashboardStats";
import { useDashboardData } from "@/hooks/useDashboardData";
import LoadingFallback from "@/LoadingFallback";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}

interface ConversionType {
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <div className="stat-card">
    {icon && <div className="stat-card-icon">{icon}</div>}
    <h3>{label}</h3>
    <p>{value}</p>
  </div>
);

const getDashboardStats = async (): Promise<DashStats> => {
  // TODO: Replace with actual API call
  return Promise.resolve({
    totalCustomers: 1250,
    activeChats: 45,
    resolvedChats: 892,
    satisfaction: 94.5,
  });
};

const DashboardContainer: React.FC = memo(() => {
  const [conversationWeek, setConversationWeek] = useState<ConversionType>({
    label: "Today",
    value: "today",
  });
  const [applicationReset, setApplicationReset] = useState<boolean>(false);
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { state } = useLocation();
  const appResetLoading = state?.loading ?? false;

  const {
    dashboardData,
    walletBalance,
    walletBalanceValue,
    walletCredit,
    memoryFiles,
    loading,
    error,
    refreshData,
  } = useDashboardData(conversationWeek.value);

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  React.useEffect(() => {
    if (appResetLoading) {
      setApplicationReset(true);
      setTimeout(() => {
        setApplicationReset(false);
        navigate("/dashboard", { replace: true });
      }, 3000);
    }
  }, [appResetLoading, navigate, applicationReset]);

  if (applicationReset) {
    return (
      <div className="dashboard-container h-[80lvh]">
        <LoadingFallback />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          {error}
          <button onClick={() => refreshData()} className="ml-2 retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="!text-xl font-medium !text-BLACK-_600 dark:!text-gray-400 !mb-1">
            Welcome, {auth.user?.first_name}
          </h1>
          <p className="text-sm text-BLACK-_300">Here's what's happening</p>
        </div>
        <button
          onClick={() => refreshData()}
          className="refresh-button"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      <DashboardStats
        loading={loading}
        walletBalance={walletBalanceValue as string}
        dashboardData={dashboardData}
        firstRender
        conversationWeek={conversationWeek}
        setConversationWeek={setConversationWeek}
      />
      <QuickAccess />
    </div>
  );
});

const Dashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<DashboardContainer />} />
    </Routes>
  );
};

export default Dashboard;

// TODO: Replace with actual API call
// const {
//   data: stats,
//   loading,
//   error,
//   isValidating,
//   refetch,
// } = useDataFetching<DashboardStats>(getDashboardStats, [], {
//   showToasts: {
//     error: true,
//     success: false,
//   },
//   toastMessages: {
//     error: (error) => `Failed to load dashboard statistics: ${error.message}`,
//   },
//   pollingInterval: 30000, // Poll every 30 seconds
//   pollingEnabled: true,
//   revalidateOnFocus: true,
//   revalidateOnReconnect: true,
//   retryCount: 3,
//   onSuccess: (data, dispatch) => {
//     // You can dispatch Redux actions here
//     dispatch({ type: "dashboard/statsUpdated", payload: data });
//   },
//   onError: (error, dispatch) => {
//     dispatch({ type: "dashboard/statsError", payload: error.message });
//   },
//   transform: (data) => ({
//     ...data,
//     // You can transform the data here if needed
//     satisfaction: Number(data.satisfaction.toFixed(1)),
//   }),
// });

{
  /* <div className="stats-grid">
        <StatCard
          label="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
        />
        <StatCard
          label="Active Chats"
          value={stats.activeChats.toLocaleString()}
        />
        <StatCard
          label="Resolved Chats"
          value={stats.resolvedChats.toLocaleString()}
        />
        <StatCard label="Satisfaction Rate" value={`${stats.satisfaction}%`} />
      </div> */
}
{
  /* <div className="flex gap-2 items-center mt-4">
        <button
          onClick={handleOpenBasicModal}
          className="text-black border-[#1447ad]"
        >
          Edit Profile
        </button>
        <button
          onClick={handleOpenConfirmModal}
          className="text-red-500 border-red-900"
        >
          Delete Item
        </button>
      </div> */
}
{
  /* <ModalExamples /> */
}

// // Example of opening a basic modal
// const handleOpenBasicModal = () => {
//   openModal(
//     MODAL_IDS.EDIT_PROFILE,
//     <Modal
//       title="Edit Profile"
//       onClose={() => closeModal(MODAL_IDS.EDIT_PROFILE)}
//     >
//       {/* Your modal content */}
//       <Modal.Body>
//         <p className="text-sm text-gray-500">Edit profile form goes here</p>
//       </Modal.Body>

//       {/* Your modal footer */}
//       <Modal.Footer>
//         <button
//           className="bg-red-800"
//           onClick={() => closeModal(MODAL_IDS.EDIT_PROFILE)}
//         >
//           Close
//         </button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// // Example of opening a confirmation modal
// const handleOpenConfirmModal = () => {
//   openModal(
//     MODAL_IDS.CONFIRM_DELETE,
//     <ConfirmModal
//       title="Confirm Delete"
//       message="Are you sure you want to delete this item?"
//       onConfirm={() => {
//         // Handle confirmation
//         closeModal(MODAL_IDS.CONFIRM_DELETE);
//       }}
//       onCancel={() => closeModal(MODAL_IDS.CONFIRM_DELETE)}
//       type="neutral"
//     />
//   );
// };
