import React, { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "@/assets/img/Logo.png";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-background-dark py-12 px-8 flex flex-col justify-evenly">
      <div className="flex justify-between">
        <div
          className="w-[93px] h-[30px] cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <img src={Logo} alt="logo" />
        </div>
        <div className="">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        {children}
      </div>
      <div className="flex-1 flex items-end">
        <p className="text-[18px] font-normal text-[#828282] cursor-pointer">
          Terms and Conditions
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
