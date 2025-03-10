import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './Customer.css';

interface ConversationProps {
  customerData: {
    conversations: Array<{
      id: string;
      content: string;
      timestamp: string;
      conversation_summary?: string;
    }>;
  };
}

const Conversation: React.FC = () => {
  const { customerData } = useOutletContext<ConversationProps>();

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="conversation-container">
      {customerData.conversations.length === 0 ? (
        <div className="no-conversations">
          No conversations found for this customer.
        </div>
      ) : (
        <div className="conversations-list">
          {customerData.conversations.map((conversation) => (
            <div key={conversation.id} className="conversation-item">
              <div className="conversation-header">
                <span className="conversation-timestamp">
                  {formatDate(conversation.timestamp)}
                </span>
              </div>
              <div className="conversation-content">
                {conversation.content}
              </div>
              {conversation.conversation_summary && (
                <div className="conversation-summary">
                  <h4>Summary</h4>
                  <p>{conversation.conversation_summary}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Conversation;
