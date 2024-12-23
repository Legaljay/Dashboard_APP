import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Customer from './components/Customer';
import Conversation from './components/Conversation';
import Summary from './components/Summary';
import Notes from './components/Notes';

// const Customer = lazy(() => import('./components/Customer'));
// const Conversation = lazy(() => import('./components/Conversation'));
// const Summary = lazy(() => import('./components/Summary'));
// const Notes = lazy(() => import('./components/Notes'));

const CustomerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Customer />}>
        <Route index element={<Conversation />} />
        <Route path="conversation" element={<Conversation />} />
        <Route path="summary" element={<Summary />} />
        <Route path="notes" element={<Notes />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;