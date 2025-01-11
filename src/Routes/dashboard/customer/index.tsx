import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLandingPage from './components/CustomerLandingPage';
import CustomerDetailsPage from './components/CustomerDetailsPage';
import Conversation from './components/Conversation';
import Summary from './components/Summary';
import Notes from './components/Notes';

const Customer = lazy(() => import('./components/Customer'));


const CustomerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Customer />}>
        <Route index element={<CustomerLandingPage />} />
        <Route path=":conversationId" element={<CustomerDetailsPage />}>
          <Route path="conversation" element={<Conversation />} />
          <Route path="summary" element={<Summary />} />
          <Route path="notes" element={<Notes />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;