import React, { memo } from "react";
import { cn } from "../../../lib/utils";
import { HiArrowLeft } from "react-icons/hi2";
import NavigateBack from "@/components/NavigateBack";

interface FormHeaderProps {
  Logo?: string;
  title: string;
  text: string;
  width?: number;
  padddown?: string;
  description?: string;
  className?: string;
  textContainerClass?: string;
  allowNavigation?: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  Logo,
  title,
  text,
  width = 246,
  padddown,
  description,
  className,
  textContainerClass,
  allowNavigation = false,
}) => {
  const widthClass = `w-[${width}px]`;

  return (
    <div
      className={cn(
        "mx-auto flex flex-col justify-center gap-[20px] relative",
        widthClass,
        className
      )}
    >
      {Logo ? (
        <img src={Logo} alt="Wano logo" className="w-[35px] mx-auto " />
      ) : (
        ""
      )}
      <div className={cn("text-center space-y-2", textContainerClass)}>
        {title && (
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
        <span
          className={`mx-auto text-[16px] text-[#828282] text-center font-normal ${padddown}`}
        >
          {text}
        </span>
      </div>
      <NavigateBack navigate={allowNavigation} />
    </div>
  );
};

export default memo(FormHeader);
