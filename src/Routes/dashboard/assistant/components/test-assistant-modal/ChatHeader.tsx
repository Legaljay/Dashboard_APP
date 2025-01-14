import { MinimizeIcon, RefreshIcon } from "@/assets/svg";
import { memo } from "react";

// components/Chat/ChatHeader.tsx
interface ChatHeaderProps {
  onRefresh: () => void;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = memo(
  ({ onRefresh, onClose }) => {
    return (
      <header className="flex justify-between">
        <button
          onClick={onRefresh}
          className="p-0 flex items-center gap-2 text-[#0359D8] hover:text-[#0243A3]"
        >
          <RefreshIcon />
          <span className="text-sm font-semibold">Refresh Assistant</span>
        </button>
        <button
          onClick={onClose}
          className="p-0 flex items-center gap-2 text-[#121212] dark:text-white/50 hover:text-[#404040]"
        >
          <span className="text-sm font-semibold">Minimize</span>
          <MinimizeIcon className="text-gray-800 dark:bg-gray-800"/>
        </button>
      </header>
    );
  }
);
