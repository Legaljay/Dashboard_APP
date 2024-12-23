import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../../contexts/AppContext';
import { useDataFetching } from '../../../../hooks/useDataFetching';
import { api } from '../../../../services/api';
import './AskAssistant.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  messages: Message[];
  status: string;
}

const fetchConversation = async () => {
  try {
    const { data } = await api.get('/api/conversation');
    return data;
  } catch (err) {
    console.error('Error fetching conversation:', err);
    throw err;
  }
};

const AskAssistant: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const { data: conversationData, loading, error, refetch } = useDataFetching(fetchConversation);

  useEffect(() => {
    if (conversationData) {
      setConversation(conversationData);
    }
  }, [conversationData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString(),
    };

    // Optimistically update UI
    setConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
    } : {
      id: Date.now().toString(),
      messages: [newMessage],
      status: 'active',
    });

    setUserInput('');

    try {
      // Send message to backend
      const { data } = await api.post('/api/conversation/message', {
        message: userInput,
        conversationId: conversation?.id,
      });
      
      // Add assistant response
      if (data.message) {
        setConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, data.message],
        } : null);
      }

      // Refresh conversation data
      refetch();
    } catch (err) {
      console.error('Error sending message:', err);
      // Revert optimistic update on error
      setConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.slice(0, -1),
      } : null);
    }
  };

  if (loading) {
    return <div className="ask-assistant-loading">Loading conversation...</div>;
  }

  if (error) {
    return (
      <div className="ask-assistant-error">
        Error loading conversation. 
        <button onClick={refetch} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="ask-assistant-container">
      <div className="conversation-header">
        <h1>Ask Assistant</h1>
      </div>

      <div className="conversation-messages">
        {conversation?.messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="message-input-form">
        <textarea
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          rows={3}
          className="message-input"
        />
        <button type="submit" className="send-button" disabled={!userInput.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AskAssistant;
