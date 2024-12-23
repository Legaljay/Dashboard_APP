import React from "react";
import { HiArrowLeft } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

interface navigateBackProps {
  navigate: boolean;
  href?: string;
}

const NavigateBack: React.FC<navigateBackProps> = ({
  navigate: allowNavigation,
  href,
}) => {
  const navigate = useNavigate();
  let handleNavigation = () => navigate(-1);
  if (href) handleNavigation = () => navigate(href);
  return (
    <>
      {allowNavigation && (
        <HiArrowLeft
          className="cursor-pointer absolute top-2 -left-4 w-5 h-5 text-secondary-500 dark:text-secondary-700"
          onClick={handleNavigation}
        />
      )}
    </>
  );
};

export default React.memo(NavigateBack);