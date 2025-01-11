// ParallelRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route, useSearchParams, Link } from 'react-router-dom';
import ConversationChats from './components/ConversationChats';
import PaymentRequestComponent from './components/PaymentRequestComponent';

const SlotWrapper: React.FC<{ children: React.ReactNode; loading?: string }> = ({ children, loading = "Loading..." }) => {
  return (
    <Suspense fallback={<div>{loading}</div>} >
      {children}
    </Suspense>
  );
};

// Example slot content components
const TeamDefault = () => <PaymentRequestComponent/>;
{/* <div className='h-[69lvh]'>Team Members List</div>; */}
const TeamSettings = () => <div className='h-[69lvh]'>Team Settings</div>;

const MainDashboard = () => <div className='h-[69lvh]'>Main Dashboard</div>;
const MainProjects = () => <div className='h-[69lvh]'>Projects Overview</div>;

const Layout = () => {
  // Use search params to manage parallel routes
  const [searchParams] = useSearchParams();
  const teamView = searchParams.get('team') || 'default';
  const mainView = searchParams.get('main') || 'dashboard';

  // Determine which component to show in each slot
  const getTeamComponent = () => {
    switch (teamView) {
      case 'settings':
        return <TeamSettings />;
      default:
        return <TeamDefault />;
    }
  };

  const getMainComponent = () => {
    switch (mainView) {
      case 'projects':
        return <MainProjects />;
      default:
        return <ConversationChats />;
    }
  };

  return (
    <div className="min-h-full">
      <nav className="bg-white shadow-sm p-4 mb-4">
        <div className="flex justify-between">
          <div>
            Team Slot:
            <Link 
              to={`?team=default&main=${mainView}`}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Team List
            </Link>
            <Link 
              to={`?team=settings&main=${mainView}`}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Team Settings
            </Link>
          </div>
          <div>
            Main Slot:
            <Link 
              to={`?team=${teamView}&main=dashboard`}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Dashboard
            </Link>
            <Link 
              to={`?team=${teamView}&main=projects`}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Projects
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Team slot */}
          <div className="col-span-3 bg-white p-4 rounded-lg shadow">
            <SlotWrapper>
              {getTeamComponent()}
            </SlotWrapper>
          </div>
          
          {/* Main slot */}
          <div className="col-span-9 bg-white p-4 rounded-lg shadow">
            <SlotWrapper>
              {getMainComponent()}
            </SlotWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConversationLayout = () => {
  return (
    <Routes>
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
};

export default ConversationLayout;