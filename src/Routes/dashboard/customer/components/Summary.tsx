import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Customer.css';

interface SummaryProps {
  customerData: {
    conversations: Array<{
      id: string;
      conversation_summary?: string;
      timestamp: string;
    }>;
  };
}

const Summary: React.FC = () => {
  const { customerData } = useOutletContext<SummaryProps>();

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="summary-container"
    >
      {customerData.conversations.some(conv => conv.conversation_summary) ? (
        <div className="summaries-list">
          {customerData.conversations
            .filter(conv => conv.conversation_summary)
            .map((conversation) => (
              <div key={conversation.id} className="summary-item">
                <div className="summary-header">
                  <span className="summary-timestamp">
                    {formatDate(conversation.timestamp)}
                  </span>
                </div>
                <div className="summary-content">
                  {conversation.conversation_summary}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="no-summaries">
          No conversation summaries available.
        </div>
      )}
    </motion.div>
  );
};

export default Summary;
