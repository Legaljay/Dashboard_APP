import { UserProfile } from "@/types";
import { Message, User } from ".";
import { Avatar } from "./Avatar";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// components/Chat/MessageBubble.tsx
interface MessageBubbleProps {
  message: Message;
  user: UserProfile;
  assistantName: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  user,
  assistantName,
}) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex flex-col gap-2 p-2 ${
        isUser ? "items-end" : "bg-white/25 rounded-[12px]"
      }`}
    >
      <div className="flex items-start gap-2">
        {
          !isUser && (
            <Avatar
              src={message.application?.icon_url}
              fallback={`${assistantName} AI`}
              size="md"
            />
          )
        }
        <div className="flex flex-col">
          <span className={`text-sm font-semibold text-[#121212] dark:text-WHITE-_100 ${isUser ? "text-right" : ""}`}>
            {isUser ? "You" : assistantName}
          </span>
          {isUser ? (
            <p className="rounded-lg py-2 text-[#121212] dark:text-WHITE-_100 text-xs font-normal">
              {message.message}
            </p>
          ) : (
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              className="prose prose-sm prose-indigo"
            >
              {message.message}
            </Markdown>
          )}
        </div>
        {
          isUser && (
            <Avatar
              src={null}
              fallback={user.first_name}
              size="md"
            />
          )
        }
      </div>
    </div>
  );
};

{
  /* <div
    className="text-sm text-[#121212]"
    dangerouslySetInnerHTML={
      isUser ? undefined : { __html: marked(message.message, { sanitize: true }) }
    }
  >
    {isUser && message.message}
  </div> */
}
