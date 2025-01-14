import React, { useRef, useEffect, useState, memo, useCallback } from "react";
import { ChatWindow } from "./ChatWindow";
import { SetupPrompt } from "./SetupPrompt";
import { useAppSelector } from "@/redux-slice/hooks";
import { ChatHeader } from "./ChatHeader";
import { useTestAssistant } from "./hook/useTestAssistant";
import { Application } from "@/types/applications.types";
import { motion } from "framer-motion";
import { AgentInfo, Introduction } from ".";
import newLogo from "@/assets/svg/wanoico.svg";
import { MdVerified } from "react-icons/md";
import AiLogo from "@/assets/svg/circleisotoxal.svg";
import SterlingLogo from "@/assets/svg/SterlingCircle.svg";

interface TestAgentPopupProps {
  handleClose: () => void;
  isMinimizing: boolean;
}

export const TestAssistantPopup: React.FC<TestAgentPopupProps> = memo(({
  handleClose,
  isMinimizing,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const appId = useAppSelector(
    (state) => state.applications.selectedApplication
  ) as string;

  const assistant = useAppSelector((state) =>
    state.applications.applications.find((app) => app.id === appId)
  ) as Application;

  const memory = useAppSelector((state) => state.memory.memoryFiles);
  const memoryExists = memory.length > 0;

  //   const agent = useAppSelector((state) => state.getApplicationByUserId.agent);
  //   const memoryExists = useAppSelector((state) => state.chat.memoryExists);


  const { messages, isLoading, error, sendMessage, refreshChat } =
    useTestAssistant(appId);

  const [inputValue, setInputValue] = useState<string>("");
  const [ startChat, setStartChat ] = useState<boolean>(true)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue, assistant?.type);
    setInputValue("");
  }, [inputValue]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Enter key pressed");
      handleSend();
    }
  }, []);

  return (
    <div className="flex fixed inset-0 z-40 justify-center items-center">
      <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        exit={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className={`h-[90vh] p-6 bg-[#FAFAFA] dark:bg-background-dark fixed w-[415px] right-[26px] bottom-10 z-50 rounded-lg flex flex-col ${
          isMinimizing
            ? "animate__animated animate__slideOutDown"
            : "animate__animated animate__slideInUp"
        }`}
      >
        <ChatHeader onRefresh={() => refreshChat()} onClose={handleClose} />
        <AgentInfo agent={assistant} walletBalance={0} />

        {!memoryExists && (
          <header className="bg-[#085B53] py-4 px-[30px] rounded-t-md flex gap-1 items-center">
          <img
            src={assistant.icon_url || AiLogo}
            alt="assistant icon"
            className={`w-8 h-8 ${SterlingLogo && "rounded-full"}`}
          />
          <p className=" text-white font-sans font-bold select-none ml-[15px] capitalize">
            {assistant.name} AI
          </p>
          <MdVerified className="text-[#00E25C]" />
        </header>
        )}
        <section className="h-full flex-1 bg-[#FAFBFC] dark:bg-gray-800 border shadow border-[#F7F7F7] rounded-lg pb-1">
          {memoryExists ? (
            <div className="relative h-full">
              {startChat ? (
                <Introduction
                  assistant={assistant}
                  setShowStartChat={setStartChat}
                  reset={refreshChat}
                />
              ) : (
                <ChatWindow
                  ref={scrollRef}
                  assistant={assistant}
                  messages={messages}
                  isLoading={isLoading}
                  error={error}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSend={handleSend}
                  onKeyPress={handleKeyPress}
                />
              )}
              <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center mt-2 text-xs gap-1 justify-center text-[#828282]">
                Powered by
                <img src={newLogo} alt="sales" className="w-3 h-3" />
                <span className="text-[#1774FD]">wano</span>
              </p>
            </div>
          ) : (
            <SetupPrompt
              agent={assistant}
              handleClose={handleClose}
            />
          )}
        </section>
      </motion.div>
    </div>
  );
});
