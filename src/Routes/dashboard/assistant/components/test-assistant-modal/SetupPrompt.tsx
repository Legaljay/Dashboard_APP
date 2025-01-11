import { Button } from "@/components/ui/button/button";
import { Avatar } from "./Avatar";
import { Application } from "@/types/applications.types";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// components/SetupPrompt.tsx
interface SetupPromptProps {
  agent: Application;
  handleClose: () => void;
}

export const SetupPrompt: React.FC<SetupPromptProps> = memo(
  ({ agent, handleClose }) => {
    const navigate = useNavigate();

    const handleSetup = useCallback(() => {
      handleClose();
      setTimeout(() => {
        navigate(`/dashboard/assistant/${agent.id}/memory`);
      }, 500);
    }, [handleClose, navigate, agent]);

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Avatar
          src={agent.icon_url}
          fallback={agent.name}
          size="lg"
          className="mb-4"
        />
        <h2 className="text-lg font-semibold text-[#121212] mb-2">
          Upload Documents
        </h2>
        <p className="text-sm text-[#828282] mb-6 max-w-md">
          Your assistant requires important documents like: About, FAQs,
          Services and Support in its memory before you can start testing it.
        </p>
        <Button
          variant="black"
          className="px-4 py-[2px] rounded-lg text-xs"
          onClick={handleSetup}
        >
          Setup Assistant
        </Button>
      </div>
    );
  }
);
