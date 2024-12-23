import React, { forwardRef } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ProServiceButtonProps {
  className?: string;
  icon?: () => React.ReactNode;
  onClick?: () => void;
  text: string;
}

const ProServiceButton = forwardRef<HTMLButtonElement, ProServiceButtonProps>(
  ({ className, icon: Icon, onClick, text, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn("flex items-center gap-2 w-full", className)}
      variant="default"
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon />}
      <p>{text}</p>
      <span className="px-1.5 py-1 bg-PRIMARY text-white rounded-[4px] text-[10px]">Pro</span>
    </Button>
  );
});

export default React.memo(ProServiceButton);
