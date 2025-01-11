import { useAppSelector } from "@/redux-slice/hooks";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import React from "react";
import { AgentInfo, AgentInfoSkeleton, ErrorMessage, Message } from ".";
import { UserProfile } from "@/types";
import { CgSpinner } from "react-icons/cg";
import { Application } from "@/types/applications.types";

// components/Chat/ChatWindow.tsx
interface ChatWindowProps {
  assistant: Application
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatWindow = React.forwardRef<HTMLDivElement, ChatWindowProps>(
  (
    {
      messages,
      isLoading,
      error,
      inputValue,
      onInputChange,
      onSend,
      onKeyPress,
      assistant,
    },
    ref
  ) => {
    const user = useAppSelector((state) => state.user.profile);

    return (
      <div className="flex flex-col h-full">
        <div ref={ref} className="flex-1 max-h-[65svh] overflow-y-auto px-4 pt-1 pb-2 space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              user={user as UserProfile}
              assistantName={assistant.name as string}
            />
          ))}
          {isLoading ? (
            <AgentInfoSkeleton />
          ) : error ? (
            <ErrorMessage error={error} className="my-[12.5px]" />
          ) : (
            //   <AgentInfo
            //     agent={agent}
            //     walletBalance={walletBalance}
            //   />
            <></>
          )}
        </div>
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
          onKeyPress={onKeyPress}
          isLoading={isLoading}
        />
      </div>
    );
  }
);
