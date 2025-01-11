import { Application } from "@/types/applications.types";
import testIcon from "@/assets/svg/testRight.svg";
import { memo } from "react";

// components/AgentButton/AgentButton.tsx
interface AgentButtonProps {
    agent: Application;
    onClick: () => void;
  }
  
  export const AgentButton: React.FC<AgentButtonProps> = memo(({ agent, onClick }) => {
    const getAgentIcon = (): string => {
      if (agent?.draft?.icon_url) return agent.draft.icon_url;
      if (agent?.icon_url) return agent.icon_url;
      return '/assets/svg/test-left.svg';
    };
  
    return (
      <div 
        className="flex gap-3 bg-white items-center py-[11.25px] px-[15px] rounded-full shadow-md shadow-box hover:shadow-lg transition-shadow cursor-pointer"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
      >
        <div className="relative">
          <img
            src={getAgentIcon()}
            alt={`${agent?.name || 'Test'} assistant`}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="absolute -bottom-1 -right-1 text-[#1774FD] text-[5.163px]">
            AI
          </span>
        </div>
  
        <div className="text-[15px] font-medium text-[#121212]">
          Test Assistant
        </div>
  
        <div className="cursor-pointer">
          <img 
            src={testIcon} 
            alt="Open assistant" 
            className="w-9 h-9"
          />
        </div>
      </div>
    );
  });