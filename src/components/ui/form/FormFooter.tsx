import React from "react";
import { cn } from "../../../lib/utils";

interface FormFooter {
  question: string;
  option: string;
  onClick: () => void;
  className?: string;
}

const FormFooter: React.FC<FormFooter> = ({
  question,
  option,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-[2px] mx-auto",
        className
      )}
    >
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {question}{" "}
        <button
          type="button"
          className="text-[#1774FD] text-sm font-bold dark:text-primary-400"
          onClick={onClick}
        >
          {option}
        </button>
      </p>
    </div>
  );
};

export default React.memo(FormFooter);
