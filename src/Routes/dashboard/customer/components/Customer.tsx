import React from 'react';
import { Outlet } from 'react-router-dom';
import './Customer.css';



const Customer: React.FC = () => {

  return (
    <div className="customer-container">
      <div className="customer-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Customer;
