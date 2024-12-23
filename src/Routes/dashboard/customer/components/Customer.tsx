import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Outlet, useLocation, NavLink } from 'react-router-dom';
import { useApp } from '../../../../contexts/AppContext';
import './Customer.css';

interface CustomerData {
  id: string;
  name: string;
  email: string;
  conversations: Conversation[];
  notes: Note[];
}

interface Conversation {
  id: string;
  content: string;
  timestamp: string;
  conversation_summary?: string;
}

interface Note {
  id: string;
  content: string;
  timestamp: string;
}

interface NavItem {
  path: string;
  label: string;
}

const mainNavItems: NavItem[] = [
  { path: 'conversation', label: 'Conversation' },
  { path: 'summary', label: 'Summary' },
  { path: 'notes', label: 'Notes' }
]

const Customer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();

  const [activeTab, setActiveTab] = useState('conversation');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  // Dummy data for development
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCustomerData({
          id: id || '1',
          name: 'John Doe',
          email: 'john@example.com',
          conversations: [
            {
              id: '1',
              content: 'Initial conversation',
              timestamp: new Date().toISOString(),
              conversation_summary: 'Customer inquired about product features'
            }
          ],
          notes: [
            {
              id: '1',
              content: 'Customer prefers email communication',
              timestamp: new Date().toISOString()
            }
          ]
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customer data');
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  useEffect(() => {
    const path = location.pathname.split('/').pop() || 'conversation';
    // Set activeTab to 'conversation' when path is 'customer'
    setActiveTab(path === 'customers' ? 'conversation' : path);
  }, [location]);

  const handleTabChange = (tab: string) => {
    // Replace the current URL instead of pushing a new one
    navigate(tab, { replace: true });
    setActiveTab(tab);
  };

  if (loading) {
    return <div className="customer-loading">Loading customer data...</div>;
  }

  if (error) {
    return <div className="customer-error">{error}</div>;
  }

  if (!customerData) {
    return null;
  }

  return (
    <div className="customer-container">
      <div className="customer-header">
        <h1>{customerData.name}</h1>
        <p>{customerData.email}</p>
      </div>

      <nav className="customer-tabs">
          <ul className="!h-fit">
            {mainNavItems.map((item) => {

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `tab-button transition-colors ${
                        isActive
                          ? 'active'
                          : ''
                      }`
                    }
                  >
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        {/* <button
          className={`tab-button ${activeTab === 'conversation' ? 'active' : ''}`}
          onClick={() => handleTabChange('conversation')}
        >
          Conversation
        </button>
        <button
          className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => handleTabChange('summary')}
        >
          Summary
        </button>
        <button
          className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => handleTabChange('notes')}
        >
          Notes
        </button> */}
      </nav>

      <div className="customer-content">
        <Outlet context={{ customerData }} />
      </div>
    </div>
  );
};

export default Customer;
