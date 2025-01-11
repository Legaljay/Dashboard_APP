import React, { useEffect, useState } from 'react'
import CustomerContent from './CustomerContent';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

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


const CustomerLandingPage = () => {
    const { id } = useParams<{ id: string }>();

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
    <CustomerContent data={customerData} page={1} loading={loading} />
  )
}

export default CustomerLandingPage