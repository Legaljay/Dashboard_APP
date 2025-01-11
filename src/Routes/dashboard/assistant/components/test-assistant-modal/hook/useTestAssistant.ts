// types.ts
export interface AgentData {
  id: string;
  name: string;
  description?: string;
  icon_url?: string | null;
  personality_type?: string;
  verbose?: boolean;
  type?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  message: string;
  application?: {
    icon_url?: string;
  };
}

export interface User {
  data: {
    user: {
      first_name: string;
    };
  };
}

import { useToast } from '@/contexts/ToastContext';
import { chatConversation, createChat, createEmployeeChat, sendChatTestEmployee, setChatID } from '@/redux-slice/app-chat/app-chat.slice';
import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
// hooks/useTestAssistant.ts
import { useState, useEffect } from 'react';
// import { fetchWalletBalance } from '@/features/wallet/walletBalanceSlice';
// import { setChatID, setPreviousAppID } from '@/features/testAgent/chatSlice';


export const useTestAssistant = (applicationId: string) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const agentChatID = useAppSelector((state) => state.appChat.chatID);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const fetchMessages = async () => {
    if (!agentChatID || !applicationId) return;
    
    try {
      const response = await dispatch(chatConversation({
        applicationId,
        agentChatID
      }));

    //   axios.get(
    //     `${baseURL}/dashboard/applications/${applicationId}/chat/${chatID}/conversations`,
    //     {
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );


    //   setMessages(response.data.data.reverse());

    } catch (err: any) {
      addToast("error", err?.response?.data?.message || 'Failed to fetch messages');
    }
  };

  const initializeChat = async () => {
    if (agentChatID) return;

    try {
      const response = await dispatch(createEmployeeChat({
        applicationId,
        employeeData: {
          title: 'Testing Assistant'
        }
      })).unwrap();

    //   axios.post(
    //     `${baseURL}/dashboard/applications/${applicationId}/chat/create-employee`,
    //     { title: 'Testing Assistant' },
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );


    //   dispatch(setPreviousAppID(applicationId));
    //   dispatch(setChatID(response.data.data.id));
        dispatch(setChatID(response?.data.data.id));
    } catch (err: any) {
      addToast("error", err?.response?.data?.message || 'Failed to initialize chat');
    }
  };

  const sendMessage = async (message: string, agentType: string) => {
    if (!agentChatID) await initializeChat();
    
    setMessages(prev => [...prev, { role: 'user', message }]);
    setIsLoading(true);
    setError(null);

    try {
      await dispatch(sendChatTestEmployee({
        applicationId,
        agentChatID,
        data: { message, assistant_type: agentType },
      }));
      
    //   axios.post(
    //     `${baseURL}/dashboard/applications/${applicationId}/chat/${chatID}/conversations/send-test-employee`,
    //     { message, assistant_type: agentType },
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );

      await fetchMessages();
    } catch (err) {
      setError('Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setError(null);
    // dispatch(setChatID(''));
  };

  const refreshChat = async () => {
    setError(null);
    await fetchMessages();
  };

  useEffect(() => {
    if (applicationId) {
      fetchMessages();
    }
  }, [
    applicationId, 
    // chatID
]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
    refreshChat,
    initializeChat,
  };
};