import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
import { Application } from '@/types/applications.types';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import smile from '@/assets/svg/Shape65.svg';
import { SendMessageIcon } from "@/assets/svg";
import { RiSendPlane2Fill, RiSendPlane2Line, RiSendPlaneLine } from 'react-icons/ri';
import { PiPaperPlane, PiPaperPlaneRightDuotone, PiPaperPlaneTiltBold, PiPaperPlaneTiltThin } from 'react-icons/pi';

export interface AgentData {
  id: string;
  name: string;
  description?: string;
  icon_url?: string | null;
  personality_type?: string;
  verbose?: boolean;
  type?: string;
  draft?: {
    icon_url?: string;
  };
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

export interface WalletState {
  data: {
    tokens: number;
  };
}

export interface RootState {
  userLogin: { user: User };
  chat: {
    chatID: string;
    memoryExists: boolean;
    testEmployeeTour: boolean;
    modalVisibility: boolean;
  };
  getApplicationByUserId: {
    agent: AgentData;
    data?: {
      data: AgentData[];
    };
  };
  walletBalance: WalletState;
}

// components/UI/Button.tsx
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg ${
      variant === 'primary' ? 'bg-[#121212] text-white' : 'bg-white text-[#121212] border border-[#EEE]'
    } ${className}`}
  >
    {children}
  </button>
);


// components/ErrorMessage/ErrorMessage.tsx
interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-3 p-4 bg-white dark:bg-stone-800 rounded-[12px] ${className}`}>
      <div className="flex gap-2 items-center">
        <div className="flex justify-center items-center w-8 h-8 bg-red-100 rounded-full">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#121212] dark:text-WHITE-_100">Error</p>
          <p className="text-sm text-[#828282]">{error}</p>
        </div>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="w-[92px] flex justify-center items-center h-[37px] rounded-lg border border-[#EEE] bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors text-[#AF202D] text-sm font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

// components/AgentInfo/AgentInfo.tsx
interface AgentInfoProps {
  agent: Application;
  walletBalance: number;
  className?: string;
}

export const AgentInfo: React.FC<AgentInfoProps> = React.memo(({
  agent,
  walletBalance,
  className = '',
}) => {
  const formattedBalance = formatWalletBalance(walletBalance);
  
  return (
    <aside className={`px-4 pt-2 bg-white dark:bg-gray-800 rounded-[8px] w-[367px] shadow-sm h-[71.5px] my-[12.5px] ${className}`}>
      <div className="flex gap-3 items-center">
        <div className="basis-[24px] relative">
          <div className="flex">
            <img 
              src={agent.icon_url || '/assets/svg/test-left.svg'} 
              alt={agent.name || 'AI Assistant'} 
              className="w-5 h-5 rounded-full"
            />
            <span className="absolute -bottom-1 -right-1 text-[#1774FD] text-[5.163px]">
              AI
            </span>
          </div>
        </div>
        
        <div className="flex flex-col basis-full">
          <h2 className="text-[15px] font-medium text-[#121212]">
            {agent.name || 'Test Assistant'}
          </h2>
          <p className="text-xs text-[#7F7F81]">
            Test your assistant to see how it'll interact with your customers.
            You have{" "}
            <span className="text-[#121212] font-medium">
              {formattedBalance}
            </span>{" "}
            credits left
          </p>
        </div>
      </div>
    </aside>
  );
});


interface IntroductionProps {
  assistant: Application;
  setShowStartChat: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
}

export const Introduction: React.FC<IntroductionProps> = React.memo(({ assistant, setShowStartChat, reset }) => {

  const handleClick = useCallback(() => {
    setShowStartChat(false);
    reset();
  }, [setShowStartChat, reset]);

  return (
    <div className=" h-full p-[7%] flex flex-col gap-3 items-center justify-center">
      <div className="flex justify-center">
        <img src={smile} alt="sales" className="w-10 h-10" />
      </div>

      <p className="text-base text-center">
        I’m {assistant.name} 👋
      </p>
      <p className="text-xs text-center">
        I’m here to answer any questions you have. Let’s start a
        conversation
      </p>
      <button
        onClick={handleClick}
        className="flex gap-1 items-center w-full justify-center px-4 py-3 rounded-lg bg-[#1774FD]"
      >
        <p className="text-[#ffffff] text-center text-xs font-semibold leading-[14.4px]">
          Start New Conversation
        </p>
        <PiPaperPlaneTiltBold color='#fff' size={12}/>
      </button>
    </div>
  )
});

// components/AgentInfo/LoadingSkeleton.tsx
export const AgentInfoSkeleton: React.FC = () => (
  <aside className="px-4 pt-2 bg-white rounded-[8px] w-full shadow-sm h-[71.5px] my-[12.5px] animate-pulse">
    <div className="flex gap-3">
      <div className="mt-4">
        <div className="w-5 h-5 bg-gray-200 rounded-full" />
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <div className="w-1/3 h-4 bg-gray-200 rounded" />
        <div className="w-full h-3 bg-gray-200 rounded" />
      </div>
    </div>
  </aside>
);

// hooks/useAgentInfo.ts
export const useAgentInfo = (agentId: string) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
//   const walletBalance = useAppSelector((state) => state.businessWallet.wallets?.tokens);
//   const agent = useAppSelector((state) => state.getApplicationByUserId.agent);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // await dispatch(fetchWalletBalance());
        setError(null);
      } catch (err) {
        setError('Failed to fetch wallet balance');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, agentId]);

  return {
    // agent,
    // walletBalance,
    isLoading,
    error,
  };
};















// utils/formatters.ts
export const formatWalletBalance = (balance: number): string => {
  const num = Math.floor(balance);
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};

// utils/constants.ts
export const ANIMATION_DURATION = 500;
export const API_ENDPOINTS = {
  CHAT: '/dashboard/applications/:id/chat',
  CONVERSATIONS: '/dashboard/applications/:id/chat/:chatId/conversations',
  CREATE_EMPLOYEE: '/dashboard/applications/:id/chat/create-employee',
} as const;