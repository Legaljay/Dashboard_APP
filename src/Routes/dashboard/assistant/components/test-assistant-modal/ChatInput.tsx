import { SendMessageIcon } from "@/assets/svg";
import { CgSpinner } from "react-icons/cg";

// components/Chat/ChatInput.tsx
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  isLoading,
}) => (
  <div className="relative px-2 pb-6 mt-auto">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder="Ask me anything"
      className="w-full p-2 pr-10 bg-transparent border rounded-lg outline-none focus:ring-2 focus:ring-[#1774FD]"
    />
    <button
      onClick={onSend}
      disabled={isLoading}
      className="absolute right-4 top-[33%] -translate-y-1/2 p-0"
    >
      {isLoading ? (
        <CgSpinner className="animate-spin text-lg text-[#121212] dark:text-WHITE-_100" />
      ) : (
        <SendMessageIcon />
      )}
    </button>
  </div>
);
