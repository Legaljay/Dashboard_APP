import React from 'react';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import DashboardCard from '../../../../components/DashboardCard';
import "./Analytics.css";

interface AnalyticsData {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  tokenUsage: number;
  costEstimate: number;
  timeRange: string;
}


const Analytics: React.FC = () => {
  const { analyticsData, isLoading, error, refreshAnalytics } = useAnalytics();

  if (isLoading) {
    return <div className="analytics-loading">Loading analytics data...</div>;
  }

  if (error) {
    return (
      <div className="analytics-error">
        Error loading analytics data. Please try again later.
        <button onClick={refreshAnalytics} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Analytics Dashboard</h1>

      <div className="analytics-grid">
        <DashboardCard
          title="Total Requests"
          value={analyticsData.totalRequests.toLocaleString()}
        />

        <DashboardCard
          title="Success Rate"
          value={((analyticsData.successfulRequests / analyticsData.totalRequests) * 100).toFixed(2) + "%"}
        />

        <DashboardCard
          title="Failed Requests"
          value={analyticsData.failedRequests.toLocaleString()}
        />

        <DashboardCard
          title="Average Response Time"
          value={analyticsData.averageResponseTime.toFixed(2) + "ms"}
        />

        <DashboardCard
          title="Token Usage"
          value={analyticsData.tokenUsage.toLocaleString()}
        />

        <DashboardCard
          title="Estimated Cost"
          value={"$" + analyticsData.costEstimate.toFixed(2)}
        />
      </div>

      <div className="analytics-filters">
        <select
          value={analyticsData.timeRange}
          onChange={(e) => {
            // Handle time range change
          }}
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>
    </div>
  );
};

export default Analytics;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useApp } from "../../../../contexts/AppContext";
// import { useDataFetching } from "../../../../hooks/useDataFetching";
// import "./Analytics.css";
// import { api } from "../../../../services/api";

// interface AnalyticsData {
//   totalRequests: number;
//   successfulRequests: number;
//   failedRequests: number;
//   averageResponseTime: number;
//   tokenUsage: number;
//   costEstimate: number;
//   timeRange: string;
// }

// const fetchAnalytics = async (): Promise<AnalyticsData> => {
//   try {
//     const response = await api.get("/api/analytics");
//     const data = response.data;

//     const analyticsData: AnalyticsData = {
//       totalRequests: data.totalRequests,
//       successfulRequests: data.successfulRequests,
//       failedRequests: data.failedRequests,
//       averageResponseTime: data.averageResponseTime,
//       tokenUsage: data.tokenUsage,
//       costEstimate: data.costEstimate,
//       timeRange: data.timeRange,
//     };
//     return analyticsData;
//   } catch (err) {
//     console.error("Error fetching analytics:", err);
//     throw err;
//   }
// };

// const Analytics: React.FC = () => {
//   const navigate = useNavigate();
//   const { state } = useApp();
//   const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
//     null
//   );
//   const { data, loading, error } = useDataFetching<AnalyticsData>(
//     fetchAnalytics,
//     [],
//     {
//       onSuccess: (data) => {
//         setAnalyticsData(data);
//       },
//       onError: (error) => {
//         console.error("Error fetching analytics:", error);
//       },
//     }
//   );

//   if (loading) {
//     return <div className="analytics-loading">Loading analytics data...</div>;
//   }

//   if (error) {
//     return (
//       <div className="analytics-error">
//         Error loading analytics data. Please try again later.
//       </div>
//     );
//   }

//   if (!analyticsData) {
//     return null;
//   }

//   return (
//     <div className="analytics-container">
//       <h1 className="analytics-title">Analytics Dashboard</h1>

//       <div className="analytics-grid">
//         <div className="analytics-card">
//           <h3>Total Requests</h3>
//           <p>{analyticsData.totalRequests}</p>
//         </div>

//         <div className="analytics-card">
//           <h3>Success Rate</h3>
//           <p>
//             {(
//               (analyticsData.successfulRequests / analyticsData.totalRequests) *
//               100
//             ).toFixed(2)}
//             %
//           </p>
//         </div>

//         <div className="analytics-card">
//           <h3>Failed Requests</h3>
//           <p>{analyticsData.failedRequests}</p>
//         </div>

//         <div className="analytics-card">
//           <h3>Average Response Time</h3>
//           <p>{analyticsData.averageResponseTime.toFixed(2)}ms</p>
//         </div>

//         <div className="analytics-card">
//           <h3>Token Usage</h3>
//           <p>{analyticsData.tokenUsage}</p>
//         </div>

//         <div className="analytics-card">
//           <h3>Estimated Cost</h3>
//           <p>${analyticsData.costEstimate.toFixed(2)}</p>
//         </div>
//       </div>

//       <div className="analytics-filters">
//         <select
//           value={analyticsData.timeRange}
//           onChange={(e) => {
//             // Handle time range change
//           }}
//         >
//           <option value="24h">Last 24 Hours</option>
//           <option value="7d">Last 7 Days</option>
//           <option value="30d">Last 30 Days</option>
//           <option value="90d">Last 90 Days</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default Analytics;
